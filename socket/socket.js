const { connect } = require("mongoose");
const { User } = require("../db");
const { Chat } = require("../db");
const { Messages } = require("../db");
const {UsersOnline} =require("../db")
const {
  addUser,
  getUser,
  removeUser,
  getUserMessage,
  findPrevUser,
  DB_UseresOnline
} = require("./users");


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
const OwneruserId = socket.handshake.query.OwneruserId

// ! Если варин окажиться рабочий перенести логику в отделльную функцию!!.
if(OwneruserId){
  DB_UseresOnline(OwneruserId, socket.id)
}
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
      });
      console.log(historyMassages);
      

      io.to(ID_SinglChat).emit("historyMassages", historyMassages);
    });

socket.on('leave', ({shiftedPrevIdUser, shiftedprevIdChat})=>{
  let user = findPrevUser(shiftedPrevIdUser)
  io.of('/').in(shiftedprevIdChat).clients((error, socketIds) => {
    if (error) throw error;
socketIds.forEach(socketId => {
  if(socketId == user.idSocket){
    io.sockets.sockets[socketId].leave(shiftedprevIdChat)
  }
});
  });
})

    socket.on(
      "sendMessage",
      async (
        { ID_SinglChat, message, OwneruserId, QuestIdUser, upLoadAnyFiles },
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
            upLoadAnyFiles: upLoadAnyFiles,
            ID_SinglChat: ID_SinglChat,
            sentTo: QuestIdUser,
          },
          (err) => {
            if (err) console.log("error at create message", err);
            io.in(ID_SinglChat).emit("message", {
              sender: sender.nick,
              avatarFile: sender.avatar,
              content: message,
              idSender: user.OwneruserId,
              upLoadAnyFiles: upLoadAnyFiles,
              timeCreateAt: new Date().toLocaleString(),
            });
            callback();
          }
        );
      }
    );

    socket.on("disconnect", async (reason) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        socket.connect();
        console.log('the disconnection was initiated by the server, you need to reconnect manually');
      }
      removeUser(socket.id);
      await UsersOnline.deleteMany({socketId: socket.id})
      console.log('disconnect');
    });


  });

  // ! Такой подход более-менее похож на правду но МНЕ не нравиться БАРДАК!!!!!!
  
  UsersOnline.watch().on('change', data =>{
    io.of('/').emit('changeStream', {change: true})
  });
};
