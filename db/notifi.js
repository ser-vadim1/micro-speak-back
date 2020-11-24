const Schema = require("mongoose").Schema;

const NotifiSchema = new Schema({
   idMessage:{
      type: String,
      require: true,
   },
   idSender:{
      type: String,
      require: true,
   },
   ID_SinglChat:{
      type: String,
      require: true
   },
   senderNick:{
      type: String,
      require: true,
   },
   senderAvatar:{
      type: String,
      require: true
   },
   sentTo: {
      type: String,
      require: true,
   },
   isOnline: {
      type: String,
      require: true,
   }
})

module.exports = {
   NotifiSchema,
}