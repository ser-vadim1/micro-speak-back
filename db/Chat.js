const Schema = require("mongoose").Schema;
const moment = require("moment");

const ChatSchema = new Schema({
  adminNick: {
    type: String,
    require: true,
  },
  idAdmin: {
    type: String,
    require: true,
  },
  idQuest: {
    type: String,
    require: true,
  },

  QuestAvatarFile: {
    type: String,
    require: true,
  },
  AdminAvatarFile: {
    type: String,
    require: true,
  },

  wasConnectedNick: {
    type: String,
    require: true,
  },
  idAdmin: {
    type: String,
    require: true,
  },

  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {
  ChatSchema,
};
