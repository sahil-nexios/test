const express = require("express");
const multer = require("multer");
const fs = require("fs");
const img = "upload/images/";

if (!fs.existsSync(img)) {
  fs.mkdirSync(img, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/images/");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.originalname}-${Date.now()}.${ext}`);
  },
});


const upload = multer({
  storage: multerStorage,
}).single('image')

module.exports = { upload };
