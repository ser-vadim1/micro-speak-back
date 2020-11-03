//** MAIN VARIBELS

const express = require("express");
const createSinglChatRouter = express.Router();
const { User } = require("../db");
const { Chat } = require("../db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//** FUNCTIONAL

createSinglChatRouter.get("/creatSinglChat", async (req, res) => {
  const { OwnerUserId, questIdUser } = req.query;

  try {
    let admin = await User.findOne({ _id: OwnerUserId });
    let quest = await User.findOne({ _id: questIdUser });

    const ChatObj = {
      adminNick: admin.nick,
      wasConnectedNick: quest.nick,
      idAdmin: admin._id,
      idQuest: quest._id,
      QuestAvatarFile: quest.avatar,
      AdminAvatarFile: admin.avatar,
    };

    const adminCreated = await Chat.findOne({
      adminNick: admin.nick,
      wasConnectedNick: quest.nick,
    });
    const _adminCreated = await Chat.findOne({
      adminNick: quest.nick,
      wasConnectedNick: admin.nick,
    });

    if (adminCreated || _adminCreated)
      return res.status(400).json({
        message: "SinglChat has been taken",
        ID_SinglChat: adminCreated ? adminCreated._id : _adminCreated._id,
      });
    const SinglChat = new Chat(ChatObj);
    await SinglChat.save((err) => {
      if (err)
        res.status(400).json({ message: `SinglChat "SAVE" error ${err}` });

      res.status(200).json({
        message: "SinglChat has been saved",
        ID_SinglChat: SinglChat._id,
      });
    });
  } catch (error) {
    console.log(error);
  }
});

//** EXPORTS

module.exports = { createSinglChatRouter };
