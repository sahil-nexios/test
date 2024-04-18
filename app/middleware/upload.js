const express = require("express");
const multer = require("multer");
const fs = require("fs");
const file = "upload/files/";
const img = "upload/images/";

if (!fs.existsSync(file)) {
  fs.mkdirSync(file, { recursive: true });
}
if (!fs.existsSync(img)) {
  fs.mkdirSync(img, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      file.fieldname == "photo_1" ||
      file.fieldname == "photo_2" ||
      file.fieldname == "photo_3" ||
      file.fieldname == "photo_4" ||
      file.fieldname == "photo_5" ||
      file.fieldname == "photo_6"
    ) {
      cb(null, "upload/images/");
    } else if (
      file.fieldname == "file_1" ||
      file.fieldname == "file_2" ||
      file.fieldname == "file_3"
    ) {
      cb(null, "upload/files/");
    }
  },
  filename: function (req, file, cb) {
    // console.log("new==================", req.files)
    // const ext = file.mimetype.split("/")[1];
    // console.log("🚀 ~ file: upload.js:27 ~ ext:", ext)
    // cb(null, `${file.originalname}-${Date.now()}.${ext}`);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// const maxSize = 20 * 1024 * 1024; // 10 MB

const upload = multer({
  storage: multerStorage,
  // limits: { fileSize: maxSize },
  // fileFilter: (req, file, cb) => {
  //     if (!file.originalname.match(/\.(pdf|jpg|jpeg|png|svg|pdf|mp4|webp|avif)$/)) {
  //         return cb(new Error('Please upload a valid pdf file'));
  //     }
  //     cb(null, true);
  // }
}).fields([
  { name: "photo_1" },
  { name: "photo_2" },
  { name: "photo_3" },
  { name: "photo_4" },
  { name: "photo_5" },
  { name: "photo_6" },
  { name: "file_1" },
  { name: "file_2" },
  { name: "file_3" },
]);

module.exports = upload;
