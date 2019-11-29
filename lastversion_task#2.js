const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const backupConfig = {
	s3BucketName: 'maksstaticwebsite',
	region: 'eu-central-1'
};

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  else {
		AWS.config.update({region: backupConfig.region});
		s3.listObjectVersions(params = {
			Bucket: backupConfig.s3BucketName
		}, function(err, data){
			if (err) {
				throw err;
			}
			else {
				const params = {
					Bucket: backupConfig.s3BucketName
				};
				data.Versions.forEach(element => {
					params.Key = element.Key;
					const file = s3.getObject(params).createReadStream();
					const myFile = fs.createWriteStream(path.join(__dirname, `${element.Key}`));
					file.pipe(myFile);
				});
			}
		});
  }
});


