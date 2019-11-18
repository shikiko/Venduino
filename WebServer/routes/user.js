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
    .whereRaw("LOWER(username) LIKE '%' || LOWER(?) || '%' ", req.body.username)
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

router.post('/buy', passport.authenticate('jwt', {session: false}), (req, res) => {
	if(!req.body.machine_id || !req.body.item_id || !req.body.quantity){ return res.status(200).send("Incorrect parameters received.");}
	var user_model = {};
	var machine_model = {};
	var item_model = {};
	var inventory_model = {};

	//Experimental test//
	var dgram = require('dgram');
	//const socket = dgram.createSocket('udp4');

	//Listening server//
	// socket.on('listening', () => {
		// let addr = socket.address();
		// console.log('Listening for UDP packets at 8082');
	// });
	// socket.bind(8082);

	// socket.on('message', (msg, rinfo) => {
		// console.log('Recieved UDP message: ' + msg);
		// socket.close();
	// });

	//Retrieve data from USER, MACHINE and ITEM
  knex('USER').select("*")
    .whereRaw("LOWER(username) LIKE '%' || LOWER(?) || '%' ", req.user['username'])
	.then(data =>{
		user_model = data[0];
		if(user_model['price'] == 0){return res.status(200).send("Insufficient balance");}
		knex('MACHINE').select("*").where('machine_id',req.body.machine_id)
		.then(data =>{
			machine_model = data[0];
			knex('ITEMS').select("*").where('item_id', req.body.item_id)
			.then(data =>{
				item_model = data[0];
				knex('INVENTORY').select("*").where({
					item_id: req.body.machine_id,
					machine_id: req.body.item_id
				}).then(data =>{
					if(data.length == 0){ return res.status(200).send("Out of stock");}
					inventory_model = data[0];
					if(user_model['balance'] < (item_model['price']*req.body.quantity))
					{
						console.log("User does not have enough money");
						res.status(200).send("Insufficient balance");
						return;
					}
					user_model['balance'] -= item_model['price'];
					inventory_model['quantity'] -= req.body.quantity;
					console.log("User balance: " + user_model['balance'] + " " + "inventory quantity: " + inventory_model['quantity']);
					knex('USER').where('user_id', user_model['user_id'])
					.update({
						balance: user_model['balance']
					}).catch((err) => { console.log( err); throw err });
					knex('INVENTORY').where({
						item_id: inventory_model['item_id'],
						machine_id: inventory_model['machine_id']
					})
					.update({
						quantity: inventory_model['quantity']
					}).catch((err) => { console.log( err); throw err });
				});
			});
			var client = dgram.createSocket('udp4');
			client.send(req.body.item_id,0, 20, 8082, machine_model['ip'], function(err, bytes) {
				console.log("Sent item id to machine ip: " + machine_model['ip']);
				client.close();
			});
		});
	});

	res.status(200).send("Transaction successful.");
});

 module.exports = router;
