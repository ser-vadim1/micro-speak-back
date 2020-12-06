//** MAIN VARIBELS

const express = require("express");
const { check, validationResult } = require("express-validator");
const AuthRoute = express.Router();
const app = express();
const { passport } = require("../Auth/Auth");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//** FUNCTIONAL
AuthRoute.get('/facebook', passport.authenticate('facebook'));


AuthRoute.get("/facebook/callback", 
passport.authenticate('facebook', (err)=>{
  if(err) console.log('err', err)
}),
(req, res, next) => {
  console.log('xx');
    // Successful authentication, redirect home.
    res.json({message: "ok?"})
  });




AuthRoute.post(
  "/registration",
  [
    check("email", "wrong email").isEmail(),
    check("password", "password should be minimum 6 simbol").isLength({
      min: 6,
    }),
  ],
  async (req, res, next) => {
    const { email, nick, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "incorect data during registration",
      });
    }
    const condidateEmail = await User.findOne({ email });
    const condidateNick = await User.findOne({ nick });
    if (condidateEmail) {
      return res
        .status(400)
        .json({ message: "User with this email has already been created" });
    } else if (condidateNick) {
      return res
        .status(400)
        .json({ message: "User with this nick has already been created" });
    }

    try {
      const EmailToken = jwt.sign(
        { email, nick, password },
        process.env.SECRET,
        {
          expiresIn: "1min",
        }
      );
      let link = `${process.env.CLIENT_SIDE}/api/auth/confirmation${EmailToken}`;
      let transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.MY_PASSWORD_Mail,
        },
      });

      let result = await transporter.sendMail({
        from: process.env.MY_EMAIL,
        to: email,
        subject: "confirm email",
        text: `Hi ${nick} \n
           Please click on the following ${link} to conform email. \n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      });
      res.status(200).json({
        message: `Check your email for confirm`,
        EmailToken,
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
);

AuthRoute.get("/confirmation:token", async (req, res, next) => {
  const { email, nick, password } = jwt.decode(req.params.token);

  const user = new User({ email, nick, password, avatar: "" });

  let userConfirmed = await User.findOne({ email });
  
  jwt.verify(req.params.token, process.env.SECRET, async (error, decoded) => {
    if (error && !userConfirmed) {
      return res
        .status(401)
        .json({ message: "Token invalid or exaried sign up again" });
    }
    try {
      if (!userConfirmed) {
        user.confirmed = true;
        await user.save(async (error, user) => {
          if (error) {
            return res.status(400).json({ message: "duplicate key" });
          } else {
            req.login(user, { session: false }, async (error) => {
              if (error) return next(error);

              const body = {
                _id: user._id,
                email: user.email,
                nickname: user.nick,
              };
              const RefreshToken = jwt.sign({ user: body }, process.env.SECRET);
              res.json({
                RefreshToken,
                OwneruserId: body._id,
              });
            });
          }
        });
      } else {
        res.status(400).json({ message: "not ok" });
      }
    } catch (error) {
      res.status(400).json(error);
    }
  });
});

AuthRoute.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(400).json({ message: info.message });
      }
      if (!user.confirmed) {
        res.status(400).json({ message: "please confirm you email to login" });
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = {
          _id: user._id,
          email: user.email,
          nickname: user.nick,
        };
        const token = jwt.sign({ user: body }, process.env.SECRET);
        res.json({ token, OwneruserId: body._id });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

//** EXPORTS

module.exports = AuthRoute;
