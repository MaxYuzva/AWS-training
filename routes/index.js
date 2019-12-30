const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const multer = require('multer');
const AWS = require("aws-sdk");

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

const credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
const sns = new AWS.SNS({credentials: credentials, region: 'eu-central-1'});

var storage = multer.memoryStorage()
var upload = multer({storage: storage})
// var upload = multer({ dest: 'uploads/' })


const connection = mysql.createConnection({
  host     : 'maks-sql-db.cg7wi4nz6eua.eu-central-1.rds.amazonaws.com',
  user     : 'admin',
  password : 'MaksMaks'
});

connection.connect();
connection.query("USE instagramm",(err, rows, fields) => {});


router.post('/', upload.single('photo'), function(req, res) {
	AWS.config.getCredentials(function(err) {
		if (err) console.log(err.stack);
		else {
			let params = {
        Bucket: 'maks-instagramm',
        Key: req.file.originalname,
        Body: req.file.buffer
			};
			
			s3.upload(params, function(err, data) {
        if (err) {
            throw err;
				}

				let sql = "INSERT INTO shop VALUES ?";
				var values = [
					[req.file.originalname,data.Location]
				];

				connection.query(sql, [values], function(err, rows, fields){
					if (err) throw err;
					
					let params = {
						Message: 'new image in Maks Instagramm',
						Subject: 'new image',
						TopicArn: 'arn:aws:sns:eu-central-1:446568060099:maks-instagramm-topic'
				};
		
				sns.publish(params, function(err, data) {
						if (err) console.log(err, err.stack); 
						else console.log(data);
				});

					res.json({success: true})
				});
    });
		}
	});
});

router.get('/random', function(req, res, next) {
	connection.query("SELECT * FROM shop ORDER BY RAND() LIMIT 1", function(err, rows, fields){
		if (err) throw err;
		res.json({data: rows})
	});
});

router.get('/all', function(req, res, next) {
	connection.query("SELECT * FROM shop", function(err, rows, fields){
		if (err) throw err;
		res.json({data: rows})
	});
});

router.get('/:name', function(req, res, next) {
	const name = req.params.name;
	let sql = "SELECT * FROM shop WHERE name LIKE ?";
	let like = `%${name}%`;
	connection.query(sql, like, function(err, rows, fields){
		if (err) throw err;
		res.json({data: rows})
	});
});

router.post('/subscribe', function(req, res, next) {
	let params = {
		Protocol: 'EMAIL', 
		TopicArn: 'arn:aws:sns:eu-central-1:446568060099:maks-instagramm-topic',
		Endpoint: req.body.email
	};

	sns.subscribe(params, (err, data) => {
			if (err) {
					console.log(err);
			} else {
					console.log(data);
					res.json({data: data});
			}
	});
});

router.post('/unsubscribe', function(req, res, next) {
	let params = {
		Protocol: 'EMAIL', 
		TopicArn: 'arn:aws:sns:eu-central-1:446568060099:maks-instagramm-topic',
		Endpoint: req.body.email
	};

	sns.unsubscribe(params, (err, data) => {
			if (err) {
					console.log(err);
			} else {
					console.log(data);
					res.json({data: data});
			}
	});
});


module.exports = router;
