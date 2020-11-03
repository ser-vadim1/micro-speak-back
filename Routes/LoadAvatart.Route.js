'use strict'
require("dotenv").config();

const express = require("express");
const AvatarRouter = express.Router();
const avatarRouterGet = express.Router();
const getAvatarFileName = express.Router()
const jwt = require("jsonwebtoken");
const { User } = require("../db");


      getAvatarFileName.get('/getAvatrFilename', (req, res)=>{
        const token = req.headers.authorization;
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: "sign in again" });
          } else {
            let _id = decoded.user._id;
            let user = await User.findOne({_id: _id}, (err, user)=>{
              if(err) {
                console.log('err at router getAvatarFileName=', err);
                
              }else if(!user.avatar){
                res.status(200).json({filename: '1604401363609-i7po8uwvgxb-defualt_avatar.png'})
                
              }else{
              return res.status(200).json({filename: user.avatar })
              }
            })
          }
        });
      })

      AvatarRouter.post("/profile/avatar", function (req, res, next) {
        const { file } = req;
        
        const token = req.headers.authorization;
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: "sign in again" });
          } else {
            let _id = decoded.user._id;
      
            let UpDateAvatar = await User.findByIdAndUpdate(
              _id,
              { avatar: file.filename },
              function (err, user) {
                if (err) {
                  return console.log(err)
                }else{
                   return  res.json({ filename: file.filename });
                }
              }
            );
           

          }
        });
      });





module.exports = { AvatarRouter, avatarRouterGet , getAvatarFileName};
