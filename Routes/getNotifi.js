require("dotenv").config();


const express = require("express");
const getNotifi = express.Router();
const {Notifi} = require("../db")

getNotifi.get("/getNotifi:OwnerUserId", async (req, res) =>{
   const {OwnerUserId} = req.params;

   let notifiFound = await Notifi.find({sentTo: OwnerUserId})

   res.status(200).json({message: notifiFound})

})

module.exports ={
   getNotifi
}