//** MAIN VARIBELS

require("dotenv").config();
const express = require("express");
const { check, validationResult } = require("express-validator");
const { User } = require("../db");
const forgetRouter = express.Router();
const resetRouter = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

//** FUNCTIONAL

forgetRouter.post("/forgot", function (req, res, next) {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user)
        return res.status(400).json({
          message:
            "The email address is not found. Double-check your email address and try again.",
        });

      //Generate and set password reset token
      user.generatePasswordReset();

      // Save the updated user object
      user
        .save()
        .then(async (user) => {
          let link =`${process.env.CLIENT_SIDE}/api/auth/resetPassword`
            user.resetPasswordToken;
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
            to: user.email,
            subject: "Password change request",
            text: `Hi ${user.nick} \n
  Please click on the following ${link} to reset your password. \n\n
  If you did not request this, please ignore this email and your password will remain unchanged.\n`,
          });
          res.status(200).json({
            message: `Check your email for password reset confirmation`,
          });
        })
        .catch((err) => res.status(500).json({ message: err.message }));
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

resetRouter.post(
  "/resetPassword:token",
  [
    check("password", "password should be minimum 6 simbol").isLength({
      min: 6,
    }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "password should be minimum 6 simbol",
      });
    }
    User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    }).then((user) => {
      if (!user)
        return res
          .status(401)
          .json({ message: "Password reset token is invalid or has expired." });

      //Set the new password
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      // Save
      user.save(async (err) => {
        if (err) return res.status(500).json({ message: err.message });

        try {
          // send email
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
            to: user.email,
            subject: "Password is up date",
            text: `${user.nick} \n
        your password hav been changed`,
          });
          req.login(user, { session: false }, async (error) => {
            if (error) return next(error);

            const body = {
              _id: user._id,
              email: user.email,
              nickname: user.nick,
            };
            const token = jwt.sign({ user: body }, process.env.SECRET);
            res.status(200).json({
              token,
              message: "your password is up date",
            });
          });
        } catch (error) {
          res.status(400).json({ message: error });
        }
      });
    });
  }
);
//** EXPORT
module.exports = { forgetRouter, resetRouter };
