const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const knex = require("./db");

const CONFIG = require("./config");

var opts = {}
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = CONFIG.JWT_SECRET;

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  }, async (username, password, done) => {
    knex
    .from("USER")
    .where("username", username)
    .first()
    .then(user => {
      if (user === null) {
        return done(null, false, { message: "bad username" });
      } else {
        bcrypt.compare(password, user.password).then(response => {
          if (response !== true) {
            return done(null, false, {
              message: "passwords do not match"
            });
          }
          // remove password from req.user
          delete user.password;
          return done(null, user);
        });
      }
    });
  }));
  
  
  passport.use(new JWTStrategy(opts,
    (jwtPayload, done) => {
      if (Date.now() > jwtPayload.expires) {
        return done(null, false, {
            message: "jwt expired"
          });
      }
  
      return done(null, jwtPayload);
    }
  ));