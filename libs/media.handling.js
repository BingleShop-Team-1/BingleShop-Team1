require("dotenv").config();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  // cloud_name: process.env.Name,
  // api_key: process.env.Key,
  // api_secret: process.env.Secret,
  secure: true,
});

// upload ke cloudinary
const uploadCloud = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file);
    return result.secure_url;
  } catch (error) {
    console.log(error);
  } finally {
    fs.unlinkSync(file);
  }
};

const localStore = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    let fileName = String(Date.now()) + "-" + file.originalname;
    cb(null, fileName);
  },
});

const fillter = (req, file, cb) => {
  if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new Error("Invalid file type"), false);
};

const uploader = multer({storage: localStore, fileFilter: fillter});

module.exports = {uploadCloud, uploader};
