const AWS = require("aws-sdk");
const path = require("path");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "ap-south-1",
});

const uploadFileToS3 = async (buffer, fileName, mimetype) => {
  // Allowed MIME types
  const allowedMimes = [
    "image/", // images (png, jpg, jpeg, gif)
    "video/", // videos (mp4, mov)
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  // Allowed file extensions (fallback for unknown MIME types)
  const allowedExts = [
    ".png", ".jpg", ".jpeg", ".gif",
    ".mp4", ".mov",
    ".pdf", ".doc", ".docx", ".txt"
  ];

  const fileExt = path.extname(fileName).toLowerCase();

  // Check if file is allowed by MIME type or extension
  const isAllowed = allowedMimes.some((type) => mimetype.startsWith(type)) || allowedExts.includes(fileExt);

  if (!isAllowed) {
    throw new Error("Unsupported file type");
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `chat-media/${fileName}`, // optional: folder for all chat files
    Body: buffer,
    ContentType: mimetype,
    ACL: "public-read",
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};

module.exports = uploadFileToS3;
