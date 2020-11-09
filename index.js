require("dotenv").config();

const https = require("https");
const express = require("express");
const socketio = require("socket.io")
const app = express();
const server = https.createServer(app);
const io = socketio(server);

require("./socket/socket.js")(io);

const PORT = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const { forgetRouter, resetRouter } = require("./Routes/Forget.Route");
const { AvatarRouter, avatarRouterGet, getAvatarFileName } = require("./Routes/LoadAvatart.Route");
const { createSinglChatRouter } = require("./Routes/createSinglChat.Router");
const { getAddedChats } = require("./Routes/getAddedChats.Router");
const { searchRouter } = require("./Routes/searchUsers.Router");
const { upLoadAnyFilesRouter } = require("./Routes/uploadAnyFiles.Router");
const {searchUsersOnline} = require("./Routes/searchUsersOnline.Router")
const {searchAddedUsersRouter} = require("./Routes/searchAddedUsers")
const gm = require('gm')
const jimp = require("jimp")
const fs = require("fs")
let cors = require("cors");
let multer = require("multer");

// **********************************************************
app.use(cors());
app.use("/uploadedAvatar", express.static("./public/uploadAvatar"));
app.use("/uploadedAnyFiles", express.static("./public/uploadedAnyFiles"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// **********************************************************

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploadAvatar`);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        Math.random().toString(36).replace("0.", "") +
        "-" +
        file.originalname
    );
  },
});




let upload = multer({storage: storage }).single("avatar");


app.use("/api/auth", require("./Routes/Auth.Routes"));

app.use("/api/auth/user", require("./Routes/secure-routes"));

app.use("/api/user", forgetRouter);

app.use("/api/user", resetRouter);

app.use("/api/user", upload, AvatarRouter);

app.use("/api/user", avatarRouterGet);

app.use("/api/user", getAvatarFileName)

app.use("/api", searchRouter);

app.use("/api", createSinglChatRouter);

app.use("/api", upLoadAnyFilesRouter);

app.use("/api/user", getAddedChats);

app.use("/api/search/usersOnline", searchUsersOnline )

app.use('/api/search/addedUsers', searchAddedUsersRouter)

  


server.listen(PORT, () => {
  console.log(`Server run at port ${PORT}`);
});
