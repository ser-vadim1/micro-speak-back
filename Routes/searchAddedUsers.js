const express = require("express");
const { check, validationResult } = require("express-validator");
const searchAddedUsersRouter = express.Router();
const { passport } = require("../Auth/Auth");
const { User, Chat } = require("../db");
const ObjectID = require("mongodb").ObjectID;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

searchAddedUsersRouter.post('/:OwnerUserId', async (req, res)=>{
   const { OwnerUserId } = req.params;
 
   try {
      let findOwnerChats = await Chat.find({idAdmin: OwnerUserId, wasConnectedNick:{ $regex: new RegExp("^" + req.body.nick, "i") }})
      let findQuestChats = await Chat.find({idQuest: OwnerUserId, adminNick:{$regex: new RegExp('^'+req.body.nick, "i")}})

      let usersAddedOnline = findOwnerChats.concat(findQuestChats)
      res.status(200).json({message: usersAddedOnline})
   

     } catch (error) {
      //   ! Обработаь ошибку
      console.log("searchAddedUsersRouter ERROR", error);
    }
})



module.exports = { searchAddedUsersRouter };