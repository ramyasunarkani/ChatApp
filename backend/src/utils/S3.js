const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "ap-south-1",
});

const uploadImageToS3 = async (buffer, fileName, mimetype) => {
  if (!mimetype.startsWith("image/")) {
    throw new Error("Only images are allowed");
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `images/${fileName}`, // always goes inside "images" folder
    Body: buffer,
    ContentType: mimetype,
    ACL: "public-read",
  };

  const result = await s3.upload(params).promise();
  return result.Location; // public image URL
};

module.exports = uploadImageToS3;
