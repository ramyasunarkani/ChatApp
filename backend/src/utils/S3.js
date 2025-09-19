const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

const uploadToS3 = async (buffer, folder, fileName, mimetype) => {
  const params = {
    Bucket: "ramya-expense",
    Key: `${folder}/${fileName}`,   // flexible folder & file
    Body: buffer,
    ContentType: mimetype,
    ACL: "public-read",
  };

  const response = await s3.upload(params).promise();
  return response.Location; // public URL
};

module.exports = uploadToS3;
