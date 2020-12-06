const express = require("express");
const { passport } = require("../Auth/Auth");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const { user } = jwt.decode(req.query.secret_token);

    res.json({
      nickname: user.nickname,
      OwnerUserId: user._id,
    });
  }
);

module.exports = router;

