require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
let multer = require("multer");
const upLoadAnyFilesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const sharp = require("sharp")
const path = require('path')



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
    let NewArrFiles = []
    const { files } = req;
    console.log('files', files);
    
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
      }


         for (const file of files) {
           let image = file.mimetype == 'image/jpeg' ? sharp(file.path) : ""
           if(image){
            let metadata = await image.metadata()
            if(metadata.width > 800 || metadata.height > 800){
             image.resize(300, 300).toFile(path.resolve(file.destination, `resized_${file.filename}`), (err, info)=>{
               if(err) console.log(err);
               console.log(info);
             })
             NewArrFiles.push({
                   link: `${process.env.DOM_NAME}/uploadedAnyFiles/resized_${file.filename}`,
                   typeFile: file.mimetype,
                   originalname: file.originalname
             })
            }
          } else {
            NewArrFiles.push({
              link: `${process.env.DOM_NAME}/uploadedAnyFiles/${file.filename}`,
              typeFile: file.mimetype,
              originalname: file.originalname
            })
          }
         }

     console.log('NewArrFiles', NewArrFiles);
     
      
      res.json({
        files: NewArrFiles,
      });
      


      // let NewArrFiles = files.map(async (file, _) => {
      //   return (
      //     {
      //     link: `${process.env.DOM_NAME}/uploadedAnyFiles/${newFileName}`,
      //     typeFile: file.mimetype,
      //     originalname: file.originalname
      //   });
      // });
     
    });
  });
});

module.exports = { upLoadAnyFilesRouter };
