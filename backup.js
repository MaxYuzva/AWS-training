const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const backupConfig = {
  s3BucketName: 'maksstaticwebsite/static',
	folderPath: './static',
	region: 'eu-central-1'
};

const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const distFolderPath = path.join(__dirname, backupConfig.folderPath);


AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  else {
		AWS.config.update({region: backupConfig.region});
    fs.readdir(distFolderPath, (err, files) => {
			if (err) {
				throw err; 
			}
			else {
				if(!files || files.length === 0) {
					console.log(`provided folder '${distFolderPath}' is empty or does not exist.`);
					return;
				}
				for (const fileName of files) {
					const filePath = path.join(distFolderPath, fileName);
					if (fs.lstatSync(filePath).isDirectory()) {
						continue;
					}
					fs.readFile(filePath, (error, fileContent) => {
						if (error) { throw error; }
		
						s3.putObject({
							Bucket: backupConfig.s3BucketName,
							Key: fileName,
							Body: fileContent
						}, (res) => {
							console.log(`Successfully uploaded '${fileName}'! ${res}`);
						});
					});
				}
			}
		});
  }
});


