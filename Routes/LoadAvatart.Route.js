'use strict'
require("dotenv").config();

const express = require("express");
const AvatarRouter = express.Router();
const avatarRouterGet = express.Router();
const getAvatarFileName = express.Router()
const jwt = require("jsonwebtoken");
const { User, Chat, Messages } = require("../db");
const fs = require("fs")
const path = require('path')
const sharp = require('sharp');
const { log } = require("console");


      getAvatarFileName.get('/getAvatrFilename', (req, res, next)=>{
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
            return res.status(401).json({ message: "sign in again"});
          } else {
            let _id = decoded.user._id;
            let newFilename = `resized_${file.filename}`

            try {
            await sharp(`${file.path}`).resize(200, 200)
            .toFile(path.resolve(file.destination, newFilename), async (err, info)=>{
              if(err) console.log(err);
              fs.unlinkSync(file.path)

              let upDatateQuest =  await Chat.find({idQuest: _id})
              let upDateAdmin = await Chat.find({idAdmin: _id})
              const UpdateTogatherAva = upDateAdmin.concat(upDatateQuest)
              
              let messAva = await Messages.find({idSender: _id}, (err, doc)=>{
                if(err) console.log('error at finding and up-date avatar message', err);

                doc.forEach(async (el)=>{
                  await Messages.findByIdAndUpdate(el._id, {avatarFile: newFilename})
                })
                
              })
          

              UpdateTogatherAva.forEach( async (el)=>{
                if(el.idAdmin === _id){
               await Chat.findByIdAndUpdate(el._id, {AdminAvatarFile: newFilename})
                }else if(el.idAdmin !== _id){
                  await  Chat.findByIdAndUpdate(el._id, {QuestAvatarFile: newFilename})
                }
              })
           
            let UpDateAvatar = await User.findByIdAndUpdate(
              _id,
              { avatar: newFilename },
              function (err, user) {
                if (err) {
                  return console.log(err)
                }else{
                   return  res.json({ filename: newFilename });
                }
              }
            );
              console.log(info);
            })
            } catch (error) {
              
            }
  



            // let upDatateQuest =  await Chat.find({idQuest: _id})
            // let upDateAdmin = await Chat.find({idAdmin: _id})
            // let messAva = await Messages.find({idSender: _id})

            // messAva.forEach(async (el)=>{
            //   try {
                
            //     await Messages.findByIdAndUpdate(el._id, {avatarFile: newFilename})
            //   } catch (error) {
            //     console.log('error at update avatar at Schema messages', error);
                
            //   }
            // })            

            // if(upDatateQuest && upDateAdmin.length == 0){
            //   upDatateQuest.forEach(async(el)=>{
            //       try {
            //         await Chat.findByIdAndUpdate(el._id, {QuestAvatarFile: newFilename})
            //       } catch (error) {
                    
            //       }
            //   })
            // }else if(upDateAdmin && upDatateQuest.length == 0) {
            //   upDateAdmin.forEach(async(el)=>{
            //     try {
                  
            //       await Chat.findByIdAndUpdate(el._id, {AdminAvatarFile: newFilename})
            //     } catch (error) {
                  
            //     }
            // })
            // }
            
            // let UpDateAvatar = await User.findByIdAndUpdate(
            //   _id,
            //   { avatar: newFilename },
            //   function (err, user) {
            //     if (err) {
            //       return console.log(err)
            //     }else{
            //        return  res.json({ filename: newFilename });
            //     }
            //   }
            // );
           

          }
        });
      });





module.exports = { AvatarRouter, avatarRouterGet , getAvatarFileName};
