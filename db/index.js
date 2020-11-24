require("dotenv").config();

const mongoose = require("mongoose");
const { UserSchema } = require("./User");
const { ChatSchema } = require("./Chat");
const { MessagesSchema } = require("./messages");
const {UsersOnlineSchema} = require("./UsersOnline")
const {NotifiSchema} = require("./notifi")

const connection = mongoose.connect(
  `${process.env.DB_URL}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);





const User = mongoose.model("UserModel", UserSchema, "users");
const Chat = mongoose.model("ChatModel", ChatSchema, "chats");
const Messages = mongoose.model("MessagesModel", MessagesSchema, "messages");
const UsersOnline = mongoose.model("UsersOnlineModel", UsersOnlineSchema, 'UsersOnline')
const Notifi = mongoose.model("NotifiModel", NotifiSchema, 'Notifications')




module.exports = {
  User,
  Chat,
  Messages,
  UsersOnline,
  Notifi,
};
