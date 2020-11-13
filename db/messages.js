const Schema = require("mongoose").Schema;

const MessagesSchema = new Schema({
  sender: {
    type: String,
    require: true,
  },
  avatarFile: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  upLoadAnyFiles: {
    type: Array,
    require: false,
  },
  fileApiBrowser:{
    type: Array,
    require: false,
  },
  idSender: {
    type: String,
    require: true,
  },
  sentTo: {
    type: String,
    require: true,
  },
  timeCreateAt: {
    type: Date,
    default: Date.now,
  },
  ID_SinglChat: {
    type: String,
    require: true,
  },
});

module.exports = {
  MessagesSchema,
};
