const {UsersOnline} =require("../db");
const { notify } = require("../Routes/Auth.Routes");

const users = [];
const notyfy =[]
const obj = {}
const notifyFunc = ({idSocket, OwneruserId}) =>{
  const notyfiUser = {idSocket,OwneruserId}
  const index = notyfy.findIndex((el)=>el.OwneruserId == OwneruserId)
if(index == -1){
  notyfy.push(notyfiUser)
}
  
  return notyfy
}
  
const DB_UseresOnline = async (OwneruserId, socketId) =>{
  try {
    await UsersOnline.deleteMany({OwneruserId: OwneruserId}) 
    
    await UsersOnline.create({
      OwneruserId: OwneruserId,
      socketId: socketId,
    }, async (err, doc)=>{
      
      if(err) console.log('error at mode userOnline', err);
    })
  

   
  } catch (error) {
    console.log('DB_UseresOnline error ', error);
    
    
  }

}

const addUser = ({ idSocket, ID_SinglChat, QuestIdUser, OwneruserId }) => {

  const user = { idSocket, ID_SinglChat, QuestIdUser, OwneruserId };
  users.push(user);
  
  return { user };
};

const removeUserNotyfy = (idSocket) => {
  const index = notyfy.findIndex((user) => user.idSocket === idSocket);
  if (index !== -1) return notyfy.splice(index, 1)[0];
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
  removeUserNotyfy,
  notifyFunc,
};
