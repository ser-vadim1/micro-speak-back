require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
let multer = require("multer");
const searchUsersOnline = express.Router();
const jwt = require("jsonwebtoken");
const { User, UsersOnline } = require("../db");

searchUsersOnline.get('/', async (req, res)=>{
   let Online = await UsersOnline.find()
   res.status(200).json({message: Online})
   

})


module.exports= {searchUsersOnline}