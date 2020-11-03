const {UsersOnline} =require("../db")

const users = [];




  
const DB_UseresOnline = async (OwneruserId, socketId) =>{
  await UsersOnline.deleteMany({OwneruserId: OwneruserId})
  await UsersOnline.create({
    OwneruserId: OwneruserId,
    socketId: socketId,
  }, async (err)=>{
    if(err) console.log('error at mode userOnline', err);
     Online = await UsersOnline.find()
  })
}

const addUser = ({ idSocket, ID_SinglChat, QuestIdUser, OwneruserId }) => {
  const user = { idSocket, ID_SinglChat, QuestIdUser, OwneruserId };
  users.push(user);
  return { user };
};

const removeUser = (idSocket) => {
  const index = users.findIndex((user) => user.idSocket === idSocket);
  if (index !== -1) return users.splice(index, 1)[0];
};


const findPrevUser = (shifted) => {
  const user = users.find( (user) => user.QuestIdUser == shifted)
  let index = users.indexOf(user)
if (index !== -1) {
  users.splice(index, 1)
};

  return user
  
};

const getUser = (QuestIdUser, OwneruserId) =>
  users.find((user) => user.QuestIdUser === QuestIdUser && user.OwneruserId === OwneruserId);

const getUserMessage = (OwneruserId) =>
  users.find((user) => user.OwneruserId === OwneruserId);


module.exports = {
  addUser,
  removeUser,
  getUser,
  getUserMessage,
  findPrevUser,
  DB_UseresOnline,
};
