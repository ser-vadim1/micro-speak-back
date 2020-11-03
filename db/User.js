const Schema = require("mongoose").Schema;
const moment = require("moment");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    require: false,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  password: {
    required: true,
    type: String,
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  nick: {
    type: String,
    unique: true,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  expirePay: {
    type: Date,
  },
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  try {
    const comapre = await bcrypt.compare(password, user.password);

    return comapre;
  } catch (error) {
    console.log("you have problem with isValidPassword", error);
  }
};

UserSchema.pre("save", async function () {
  this.expirePay = moment().add(7, "day").toDate();
  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  } catch (error) {
    console.log("you have proble with hash PASWWORD", error);
  }
});

UserSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = `${crypto.randomBytes(20).toString("hex")}`;
  this.resetPasswordExpires = new Date(Date.now() + 360000); //expires in 1 an hour
};

module.exports = {
  UserSchema,
};
