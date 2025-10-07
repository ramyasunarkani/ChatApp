const multer = require("multer");

// In-memory storage for both profile pics and chat media
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
