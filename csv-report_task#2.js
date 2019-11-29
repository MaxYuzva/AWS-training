const AWS = require("aws-sdk");
const { parse } = require('json2csv');
const fs = require("fs");
const backupConfig = {
	s3BucketName: 'maksstaticwebsite',
	region: 'eu-central-1'
};

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;

AWS.config.update({region: backupConfig.region});

const params = {
	Bucket: backupConfig.s3BucketName
};

const fields = ['name', 'path'];

s3.listObjectsV2(params, function(err, data) {
	const result = {};
	if (err) {
		throw err;
	}
	else {
		data.Contents.forEach(item=>{
			result[fields[0]] = item.Key.split('/').reverse()[0];
			result[fields[1]] = item.Key
		});
		
		const csv = parse(result, {fields});
		console.log(csv);
		fs.writeFile('./files_csv/report.csv', csv, 'utf-8', function(err) {

			if(err) {
					return console.log(err);
			}
			console.log("The file was saved!");
		});
	}
});


