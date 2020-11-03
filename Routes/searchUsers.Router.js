const express = require("express");
const searchRouter = express.Router();
const { User } = require("../db");
const jwt = require("jsonwebtoken");

searchRouter.post("/searchGeneral/users", async (req, res) => {
  const { OwneruserId } = req.query;

  try {
    let users = await User.find({
      nick: { $regex: new RegExp("^" + req.body.nick, "i") },
    });
    let sortedUsers = users.filter((user, index) => user._id != OwneruserId);

    return res.status(200).json(sortedUsers);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = { searchRouter };
