require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
let multer = require("multer");
const upLoadAnyFilesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { User, Messages } = require("../db");
const sharp = require("sharp")
const path = require('path')
const fs = require('fs')



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

upLoadAnyFilesRouter.post("/upLoadAnyFiles:idMEssageDB", (req, res)=> {
  upLoadAnyFiles(req, res,  (err) =>{
    const token = req.headers.authorization;
    let NewArrFiles = []
    let AudioFiles = []
    let regexImg = /^image\/.+/
    let regexAudio =  /^audio\/.+/
    const { files } = req;
    const idMEssageDB = req.params.idMEssageDB
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


      let ImgFiles = files.filter((file)=> regexImg.test(file.mimetype) ? file : "")

        files.forEach((file)=>  {
        if(regexAudio.test(file.mimetype)){
          AudioFiles.push({
            id: `f${(~~(Math.random()*1e8)).toString(16)}`,
            src: `${process.env.DOM_NAME}/uploadedAnyFiles/${file.filename}`,
            type: file.mimetype,
            originalname: file.originalname,
          })
        }
      })
      for(const imgFile of ImgFiles){

        let image = sharp(imgFile.path)
        let metadata = await image.metadata()

        if (metadata.width > 800 || metadata.height > 800){
          let name = `resized_${imgFile.filename}`
          image.resize(800, 800)
          .tiff({
            compression: 'lzw'
          })
          .toFile(path.resolve(imgFile.destination, name), (err, info)=>{
            if(err) console.log(err);
            console.log('info',info);

          fs.unlinkSync(imgFile.path)
          })
          NewArrFiles.push(
            {
              id: `f${(~~(Math.random()*1e8)).toString(16)}`,
              src: `${process.env.DOM_NAME}/uploadedAnyFiles/${name}`,
              type: imgFile.mimetype,
              originalname: imgFile.originalname
            })
   
        }else {
          NewArrFiles.push({
            id: `f${(~~(Math.random()*1e8)).toString(16)}`,
            src: `${process.env.DOM_NAME}/uploadedAnyFiles/${imgFile.filename}`,
            type: imgFile.mimetype,
            originalname: imgFile.originalname,
          })
        }
      }
      let result = NewArrFiles.concat(AudioFiles)
      await Messages.findByIdAndUpdate(idMEssageDB, {fileApiBrowser: result})
      console.log('NewArrFiles',NewArrFiles);
      res.json({
        files: result,
      });
    });
  });
});

module.exports = { upLoadAnyFilesRouter };
