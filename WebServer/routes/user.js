const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const request = require('request');

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
          const token = jwt.sign(JSON.stringify({
            ...payload,
            // neverExpire: true
          }), CONFIG.JWT_SECRET);
  
          /** assign our jwt to the cookie */
          res.cookie('jwt', jwt, { httpOnly: true, secure: true });
          return res.status(200).send({ username: user.username, token });
        });
      },
    )(req, res);
  });
  
 router.patch('/',(req, res) =>{
	 knex('USER').select("*")
	.where('user_id',req.body.user_id)
	.then(data =>{
		if(data.length == 0){return res.status(404).send("User not found.");}
		knex('USER')
		.where({user_id: req.body.user_id})
		.update({
			username: req.body.username,
			password: bcrypt.hashSync(req.body.password, 10)
		}).catch((err) => { 
			console.log( err); 
			return res.status(400).send("An error has occured. Please try again.");
		});
		res.status(200).send("User updated.");
	});
 });
 
 router.delete('/',(req, res) =>{
	 knex('USER').where('user_id', req.body.user_id)
	 .del().catch((err) => { 
		console.log( err); 
		return res.status(400).send("An error has occured. Please try again."); 
	});
	res.status(200).send("Account ID: " + req.body.user_id + " has been successfully deleted");
 });
  
router.post('/topup', (req, res) => {
	var originalValue = 0.0;
		knex('USER').select("*")
		.where('user_id',req.body.user_id)
		.then(data =>{
			originalValue = data[0]['balance'];
			newValue = originalValue + parseInt(req.body.value);
			
			if(data.length == 0){res.send("User not found.")}
			knex('USER')
			.where({user_id: req.body.user_id})
			.update({
				balance: newValue
			}).catch((err) => { 
				console.log( err); 
				return res.status(400).send("An error has occured. Please try again.");
			});
			res.status(200).send("You have topped up your balance from: " + originalValue + " to: " + newValue);
	});
});

router.post('/buy', (req, res) => {
	console.log("I have been called");
	
	//Experimental test//
	var dgram = require('dgram');
	const socket = dgram.createSocket('udp4');
	var client = dgram.createSocket('udp4');
	
	//Listening server//
	socket.on('listening', () => {
		let addr = socket.address();
		console.log('Listening for UDP packets at ${addr.address}:${addr.port}');
	});
	socket.bind(8082);
	
	//Print to console on receiving any udp message to simulate ardunio board//
	socket.on('message', (msg, rinfo) => {
		console.log('Recieved UDP message: ' + msg);
	});
	
	//send a test udp packet to "machine id". If received, successful.
	//Change port '8082' to ardunio testing port and '127.0.0.1' to ardunio ip address for testing
	client.send('2',0, 1, 8082, '127.0.0.1', function(err, bytes) {
		client.close();
	});
	
	// knex('MACHINE').select("*").where('machine_id',req.body.machine_id)
	// .then(data =>{
		// console.log(data);
		// console.log(req.user);
		// var options = {
			// url: data[0]['ip'],
			// method: "POST",
			// agent: false,
			// headers: {
				// 'Content-type': 'text/plain'
			// },
			// body: 'hello'
		// };
		// request.post(
			// options, function(error, response, body){
			// console.log(body);});
		// });
	res.status(200).send("Transaction complete! Please wait patiently for your item...");
});
  
 module.exports = router;