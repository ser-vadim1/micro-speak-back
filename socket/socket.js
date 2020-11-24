const e = require("express");
const { connect } = require("mongoose");
const { User } = require("../db");
const { Chat } = require("../db");
const { Messages } = require("../db");
const {UsersOnline} =require("../db");
const {Notifi} = require("../db");
const {
  addUser,
  getUser,
  removeUser,
  getUserMessage,
  findPrevUser,
  DB_UseresOnline,
  
} = require("./users");
const {addNotifi, removeNotifi} = require("./notifi")
module.exports = (io) => {
    // io.use((socket, next)=>{
    //   let token = socket.handshake.query.token;
    //   if(token){
    //     // !Сделать проверку токена
    //     return next()
    //   }
    //   return console.log('no have token');
      
    // })
io.on("connection", async (socket) => {
socket.on("notification", async ({OwneruserId, QuestIdUser, message}, cb)=>{
  if(OwneruserId){
    DB_UseresOnline(OwneruserId, socket.id)
    }
  })

    socket.on("join", async ({ ID_SinglChat, QuestIdUser, OwneruserId }) => {
      
      if (ID_SinglChat  && getUser(QuestIdUser, OwneruserId) === undefined) {
        
        socket.join(ID_SinglChat, async () => {
          const { error, user } = addUser({
            idSocket: socket.id,
            ID_SinglChat,
            QuestIdUser,
            OwneruserId,
          });

        });
      }
  
      let historyMassages = await Messages.find({ 
        ID_SinglChat: ID_SinglChat,
      }).sort({$natural:-1}).limit(10);
      io.to(ID_SinglChat).emit("historyMassages", historyMassages.reverse());
    });

socket.on('leave', ({prevUSer, prevChat})=>{
  let user = findPrevUser(prevUSer)
  io.of('/').in(prevChat).clients((error, socketIds) => {
    if (error) throw error;
socketIds.forEach(socketId => {
  if(socketId == user.idSocket){
    io.sockets.sockets[socketId].leave(prevChat)
  }
});
  });
})




    socket.on(
      "sendMessage",
      async (
        { ID_SinglChat, message, OwneruserId, QuestIdUser, fileApiBrowser },
        callback
      ) => {
        const user = getUserMessage(OwneruserId);
        
        let sender = await User.findById({ _id: OwneruserId });
        

        await Messages.create(
          {
            sender: sender.nick,
            avatarFile: sender.avatar,
            content: message,
            idSender: OwneruserId,
            ID_SinglChat: ID_SinglChat,
            sentTo: QuestIdUser,
            fileApiBrowser: fileApiBrowser,
          },
         async (err, doc) => {
            if (err) console.log("error at create message", err);
            
            io.in(ID_SinglChat).emit("message", {
              id: doc._id,
              sender: sender.nick,
              avatarFile: sender.avatar,
              content: message,
              idSender: user.OwneruserId,
              fileApiBrowser: fileApiBrowser,
              timeCreateAt: new Date().toLocaleString(),
            });

            let clients = io.sockets.adapter.rooms[ID_SinglChat]
            
            let obj = await addNotifi(OwneruserId, doc._id, ID_SinglChat, sender.nick, sender.avatar, clients,QuestIdUser )
            console.log('obj', obj);

      
// определяю если в комнате один человек отправляю notifi если два то значит чат открыт и не отправлю)
            if(clients.length === 1 && obj.WhoIsNotifi){
              let sendNotifi = await UsersOnline.findOne({OwneruserId: QuestIdUser})
              if(sendNotifi){
                console.log('a am sending message notifi when i got online users');
                io.to(sendNotifi.socketId).emit("sendNotification", obj.WhoIsNotifi)
              }
            }
            callback();
          }
        );
      }
    );

    socket.on("removeNotifi", async ({ID_SinglChat})=>{
      console.log('its wirking removeNotifi', ID_SinglChat);
      removeNotifi(ID_SinglChat)
    })

    socket.on("disconnect", async (reason) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        socket.connect();
        console.log('the disconnection was initiated by the server, you need to reconnect manually');
      }
      removeUser(socket.id);
      CountMessage = 10;
      await UsersOnline.deleteMany({socketId: socket.id})

      console.log('disconnect');
    });


  });

  // ! Такой подход более-менее похож на правду но МНЕ не нравиться БАРДАК!!!!!!
  
  UsersOnline.watch().on('change', data =>{
    io.of('/').emit('changeStream', {change: true})
  });
};
