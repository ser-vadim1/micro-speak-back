const Schema = require("mongoose").Schema;
const moment = require("moment");
const socket = require("../socket/socket");

const UsersOnlineSchema = new Schema({
   OwneruserId :{
      type: String,
      require: true,
   },
   socketId: {
      type: String,
      require: true,
   },
   timeCreateAt: {
      type: Date,
      default: Date.now,
   }
})

module.exports = {
   UsersOnlineSchema,
 };
 