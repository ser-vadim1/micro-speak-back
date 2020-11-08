require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const getAddedChats = express.Router();
const jwt = require("jsonwebtoken");
const { User, Chat } = require("../db");

getAddedChats.get("/geAddedChats:OwnerUserId", async (req, res) => {
  const { OwnerUserId } = req.params;

  try {

    let QuestChat = await Chat.find({ idQuest: OwnerUserId });
    let OwnerChat = await Chat.find({ idAdmin: OwnerUserId });

    

    const CommonChats = QuestChat.concat(OwnerChat);
  

    return res.status(200).json({ CommonChats: CommonChats });
  } catch (error) {
    console.log("GetAddedChats ERROR", error);
  }
});

module.exports = { getAddedChats };
