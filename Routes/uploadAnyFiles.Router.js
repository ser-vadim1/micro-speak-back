require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
let multer = require("multer");
const upLoadAnyFilesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../db");



let storageAnyFiles = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploadedAnyFiles`);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        Math.random().toString(36).replace("0.", "") +
        "-" +
        file.originalname
    );
  },
});



let upLoadAnyFiles = multer({ storage: storageAnyFiles }).array(
  "uploadedAnyFiles",
  6
);

upLoadAnyFilesRouter.post("/upLoadAnyFiles", (req, res)=> {
  upLoadAnyFiles(req, res,  (err) =>{
    const token = req.headers.authorization;
    
    const { files } = req;
    console.log('file',files);
    
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      // ! Обработать ошибку
      return res
        .status(400)
        .json({ message: "There must be a maximum of 12 uploaded files" });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log("An unknown error occurred when uploading");
    }
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "error at UploadAnyFiles because of verify Token" });
      } else if (err) {
        console.log('error at uploadAnyfiles', err);
        // An unknown error occurred when uploading.
      }
      let NewArrFiles = files.map((file, _) => {
        
        return (
          {
          link: `${process.env.DOM_NAME}/uploadedAnyFiles/${file.filename}`,
          typeFile: file.mimetype,
          originalname: file.originalname
        });
      });
      res.json({
        files: NewArrFiles,
      });
    });
  });
});

module.exports = { upLoadAnyFilesRouter };
