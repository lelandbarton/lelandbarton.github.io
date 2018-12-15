

const AWS = require("aws-sdk"); // from AWS SDK
const fs = require("fs"); // from node.js
const path = require("path"); // from node.js

// configuration
const config = {
  s3BucketName: 'lelandbarton.com',
  folderPath: './src' // path relative script's location
};

// initialize S3 client
const s3 = new AWS.S3({ signatureVersion: 'v4' });

// resolve full folder path
const distFolderPath = path.join(__dirname, config.folderPath);
const prefixToRemove = '';

const pushFileToS3 = (currentPath) => {
	console.log(currentPath);
	// get of list of files from 'dist' directory
	fs.readdir(currentPath, (err, files) => {

	  if(!files || files.length === 0) {
	    console.log(`provided folder '${currentPath}' is empty or does not exist.`);
	    console.log('Make sure your project was compiled!');
	    return;
	  }

	  // for each file in the directory
	  for (const fileName of files) {

	    // get the full path of the file
	    const filePath = path.join(currentPath, fileName);
	    const key = path.relative(distFolderPath, filePath);

	    // ignore if directory
	    if (fs.lstatSync(filePath).isDirectory()) {
	     	pushFileToS3(filePath);
	    } else {
		    // read file contents
		    fs.readFile(filePath, (error, fileContent) => {
		      // if unable to read file contents, throw exception
		      if (error) { throw error; }


		      var contentType = 'text/html'

		      if (filePath.endsWith('css')) {
		      	contentType = 'text/css'
		      } else if (filePath.endsWith('png')) {
		      	contentType = 'text/png'
		      } else if (filePath.endsWith('jpg')) {
		      	contentType = 'text/jpg'
		      } else if (filePath.endsWith('js')) {
		      	contentType = 'text/javascript'
		      }

		      // upload file to S3
		      //console.log(currentPath, fileName)
		      s3.putObject({
		        Bucket: config.s3BucketName,
		        Key: key,
		        Body: fileContent,
		        ContentType: contentType
		      }, (res) => {
			console.log(res)
		        console.log(`Successfully uploaded '${fileName} to ${key}!`);
		      });
		      
		    });	    	
	    }


	  }
	});
}

pushFileToS3(distFolderPath);
