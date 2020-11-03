const { now } = require("moment");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { User } = require("../db");
const JWTstrategy = require("passport-jwt").Strategy,
  ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = User.create({ email, password });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          email,
        });

        if (!user) {
          return done(null, false, { message: "user not found" });
        }
        const Validate = await user.isValidPassword(password);
        if (!Validate) {
          return done(null, false, { message: "wrong password" });
        }
        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET,
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
module.exports = { passport };
