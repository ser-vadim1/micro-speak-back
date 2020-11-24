const {Notifi} = require('../db')

let WhoIsNotifi =[]

const addNotifi = async (OwneruserId ,idMassage ,ID_SinglChat, senderNick, senderAvatar, clients, QuestIdUser ) => {

   let isSentAlredy = await Notifi.findOne({ID_SinglChat: ID_SinglChat})
if(!isSentAlredy && clients.length == 1){
   const objNotifi = {
      idMessage: idMassage,
      idSender: OwneruserId,
      ID_SinglChat:ID_SinglChat,
      senderNick: senderNick,
      senderAvatar: senderAvatar,
      sentTo: QuestIdUser,
   }
   WhoIsNotifi.push(objNotifi)
   await Notifi.create(objNotifi)

   return {
      WhoIsNotifi: objNotifi,
   }
}else{
   return {
      WhoIsNotifi: "",
   }
}

   
}

const removeNotifi = async (ID_SinglChat)=>{
   let index =WhoIsNotifi.findIndex(el => el.ID_SinglChat == ID_SinglChat)
   console.log('index', index);
   await Notifi.deleteOne({ID_SinglChat: ID_SinglChat})
   if(index !== -1){
      console.log('its remove objNotifi from notifi.js at func removeNotifi');
      WhoIsNotifi.splice(index, 1)
   }
}

// const CountFunc = (idSocket)=>{
//    if(idSocket){
//       CountMessage
//    }
// }
module.exports = {
   addNotifi,
   removeNotifi,
}