const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const router = express.Router();
const knex = require("../db");

const CONFIG = require("../config");

router.get('/profile',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    knex("USER")
    .where("username", req.user.username)
    .first()
    .then(user => {
      delete user.password;
      res.status(200).send({ user });
    })
  });

router.post('/register', (req, res) => {
    console.log("/register", req.body)
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({
        error: 'Invalid body',
        });
    }
    knex("USER")
    .where("username", req.body.username)
    .first()
    .then(user => {
      if (user != null) {
        return res.status(400).send({
            error: 'username already taken',
          });
      } else {
        bcrypt
          .hash(req.body.password, CONFIG.BCRYPT_SALT_ROUNDS)
          .then(hashedPassword => {
            knex("USER").pluck("user_id").then(data => {
                var lastUID = parseInt(data[data.length - 1]);
                //Ensure that an ID is at least assigned to the user.
                if (isNaN(lastUID)) {
                  lastUID = 0;
                }
                //Add new user into the database
                var user = {
                    user_id: String(lastUID + 1),
                    username: req.body.username,
                    password: hashedPassword,
                    balance: 0.0
                }
                knex("USER")
                  .insert([user])
                  .catch(err => {
                    console.log(err);
                    return res.status(400).send({ error: 'Failed to insert user' });
                  });
                return res.status(200).send({ username: user.username });
              });
          });
      }
    });
  });
  
  router.post('/login', (req, res) => {
    passport.authenticate(
      'local',
      { session: false },
      (error, user) => {
        if (error || !user) {
            return res.status(400).json({ error });
        }
        console.log(user)
  
        /** This is what ends up in our JWT */
        const payload = {
          username: user.username,
          expires: Date.now() + parseInt(CONFIG.JWT_EXPIRATION_MS),
        };
  
        /** assigns payload to req.user */
        req.login(payload, {session: false}, (error) => {
          if (error) {
            return res.status(400).send({ error });
          }
  
          /** generate a signed json web token and return it in the response */
          const token = jwt.sign(JSON.stringify(payload), CONFIG.JWT_SECRET);
  
          /** assign our jwt to the cookie */
          res.cookie('jwt', jwt, { httpOnly: true, secure: true });
          return res.status(200).send({ username: user.username, token });
        });
      },
    )(req, res);
  });
  
  module.exports = router;
