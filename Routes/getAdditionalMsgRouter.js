require("dotenv").config();

const express = require("express");
const getAdditional_Msg = express.Router();
const {Messages} = require("../db")
let countSkipMsg = 10
let {CountMessage} = require("../socket/users")
let prevId_SinglChat = []


getAdditional_Msg.get('/getAdditional_Msg', async (req, res)=>{
   let {ID_SinglChat, count} = req.query;
   let num = Number(count);
   console.log('count',  num);
   
   try {
      let historyMessage = await Messages.find({ID_SinglChat: ID_SinglChat}).skip(num).sort({$natural: -1}).limit(10)

     
      res.status(200).json({
         message: historyMessage.reverse()
      })
   } catch (error) {
      console.log('error at router getAdditional_Msg', error);
      
   }
})

module.exports = { getAdditional_Msg };