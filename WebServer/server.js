//Web server backend for Vending Machine

// Create express app
var express = require("express")
var app = express()
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./db/VendingDB.db"
  }
});
//var db = require("./database.js")
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var passport = require('passport')
var BasicStrategy = require('passport-http').BasicStrategy;
var bcrypt = require('bcrypt');
var crypto = require('crypto');

////
////
//// Initialization methods
////
////

// Server port
var HTTP_PORT = 8000

//passport authentication and configuration
passport.use(new BasicStrategy(
	function(username,password,done){
		knex.from('USER').select("*")
		.where('username',username)
		.then(data => {
			if(data.length == 0){ return done(null, false)};
			if(!bcrypt.compareSync(password,data[0]['password'])){ return done(null, false); }
			return done(null,data);	
		});
	}
));

//Middleware function for Express to determine if user is an admin
function requireAdmin(){
	return function(req, res, next){
		//Get authorization header of the user
		let username = Buffer.from(req.get('Authorization').split(" ")[1],'base64').toString('ascii').split(":")[0];
		
		//Get the user_id from the accessing user
		knex.from('USER').select("user_id")
		.where('username', username)
		.then(data => {
			//Get data from the ADMIN table.
			knex.from('ADMIN').select("user_id")
			.where('user_id',data[0]['user_id'])
			.then(data =>{
				//If the user is an admin, there will be data retrieved
				if(data.length == 0){
					//User does not belong to the admin role.
					res.send("Restricted");
					//Log the user that tried to access sensitive content.
					return next("Restricted connection from :" + username + ": to admin only page.")
				}
				//User is an admin, continue.
				return next()
			})			
		})
	}
}

// Start server
app.listen(HTTP_PORT, () => {
	console.log("Server is initializing...");
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT));
	console.log("Ready for requests!");
});

////
////
////Web server API function methods
////
////

// Root endpoint
// Use for testing connections, can remove once not in use.
app.get("/", 
	passport.authenticate('basic', { session: false }),
	(req, res, next) => {
		console.log("Client: " + req.ip + " has connected.");
		res.send("ok");
	}
);

//
//
// API calls //
//
//
// All API calls must have basic authentication (Authorization header) field to access.
//This limits others from being able to access API links without a user account.
//requireAdmin() is required to limit sensitive data like machines, users.

//API post to retrieve all items that belong to a machine.
//Post request must include machine_id, if not it would not be processed.
app.post("/api/getInventory",
	passport.authenticate('basic', { session: false }),
	(req,res,next) =>{
	//Get all items available in a set machine
	if(!req.body.machine_id){
		//Missing machine id in req
		res.send("An error has occured, please try again.");
		return;
	}
	
	//Get items available via machine ID
	knex.from('INVENTORY').select("*")
	.innerJoin('ITEMS','INVENTORY.item_id','ITEMS.item_id')
	.where('INVENTORY.machine_id',req.body.machine_id)
	.then(data => {
		res.json({
			"message":"success",
			"data":data
		});
	}).catch((err) => { console.log( err); throw err });
});

//Incomplete - API link to buy item.
app.post("/api/buy",passport.authenticate('basic', { session: false }),(req,res,next) =>{
	
	// Set up the POST data for the vending machine to dispense
	var goip = "http://127.0.0.1:8000/catch";
	
	var request = require('request');
	var options = {
		url: goip,
		method: "POST",
		agent: false,
		headers: {
			'Content-type': 'application/json'
		},
		body: '{"test": "Hello"}'
	};
	request.post(
		options, function(error, response, body){
	console.log(body);});
	res.send("Transaction complete! Please wait patiently for your item...");
	// End
});

//Machine startup calls
//Post request by the vending machine to update the database with any new ip.
//Possibly requires a create statement if machine does not exist.
app.post("/api/vending/startup",
	passport.authenticate('basic', { session: false }),
	requireAdmin(),(req,res,next) =>{
		//Missing key values, stop updating
		if(!req.body.machine_id || !req.body.location || !req.body.ip)
		{
			res.send("Incorrect parameters received.");
			return;
		}
		//Update the new values on every machine new startup
		knex('MACHINE').select("*")
		.where('machine_id',req.body.machine_id)
		.then(data =>{
			if(data.length == 0){res.send("Machine not found."); return;}
			knex('MACHINE')
			.where({machine_id: req.body.machine_id})
			.update({
				location: req.body.location,
				ip: req.body.ip
			}).catch((err) => { console.log( err); throw err });;
			res.send("Machine details updated.");
		});
});

//Arduino POST receive test api digest//
app.post("/catch",(req,res,next) =>{
	console.log(req.body);
	res.send("thanks");
});
//End of test

//Methods for CRUD USER table
app.get("/api/user",passport.authenticate('basic', { session: false }),(req,res,next) =>{
	//Select all from USER by user_id
	knex.from('USER').select("*")
	.then(data => {
		//Return retrieved data as JSON format
		res.json({
			"message":"success",
			"data":data
		});
	}).catch((err) => { console.log( err); throw err });
});

//Create a new user with automatic ID assignment (+1 to the last added user)
app.post("/api/user",(req,res,next) =>{
	if(!req.body.username || !req.body.password)
	{
		res.send("An error has occured, please try again.");
		return;
	}
	var lastUID = 0;
	let hash = bcrypt.hashSync(req.body.password, 10);
	knex('USER').select('user_id').where('username',req.body.username)
	.then(data=>{
		if(data.length > 0){ 
			res.send("Username has been taken, please try a new one."); 
			return;
		}
		knex('USER').pluck('user_id')
		.then(data => {
			lastUID = parseInt(data[data.length-1]);
			//Ensure that an ID is at least assigned to the user.
			if(isNaN(lastUID)){lastUID = 0;}
			//Add new user into the database
			knex('USER').insert([{
				user_id: String(lastUID+1),
				username: req.body.username,
				password: hash,
				balance: 0.0
			}]).catch((err) => { console.log( err); throw err });
			res.send("Done!");
		});
	});
	
});

//PATCH request to update a specific user via USERID
//The request must include the user_id to identify the unique user to update.
//Will not process request with missing user_id.
app.patch("/api/user", passport.authenticate('basic', { session: false }),(req,res,next) =>{
	if(!req.body.user_id || !req.body.username)
	{
		res.send("An error has occurred, please try again.");
		return;
	}
	knex('USER').select("*")
	.where('user_id',req.body.user_id)
	.then(data =>{
		if(data.length == 0){res.send("User not found.")}
		knex('USER')
		.where({user_id: req.body.user_id})
		.update({
			username: req.body.username,
			password: bcrypt.hashSync(req.body.password, 10)
		}).catch((err) => { console.log( err); throw err });;
		res.send("User updated.");
	});
})

//Delete users via DELETE request
//Accepts a user_id to delete.
//Possibly adding a limiter to prevent a user from deleting another user.
app.delete("/api/user",passport.authenticate('basic', { session: false }),(req,res,next) =>{
	if(!req.body.user_id)
	{
		res.send("An error has occurred, please try again.");
		return;
	}
	knex('USER').where('user_id', req.body.user_id).del().catch((err) => { console.log( err); throw err });
	res.send("Deleted account: " + req.body.user_id);
})

//Add value to current balance
app.post("/api/user/topup",
	passport.authenticate('basic', { session: false }),
	(req,res,next) =>{
		if(!req.body.value)
		{
			res.send("Top up value is undefined");
			return;
		}
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
			}).catch((err) => { console.log( err); throw err });
			res.send("You have topped up your balance from: " + originalValue + " to: " + newValue);
	});
})

//GET API to retrieve data for all registered machines in the DB.
app.get("/api/machine", passport.authenticate('basic', { session: false }), requireAdmin(), (req,res,next) =>{
	//Select all from machine
	knex.from('MACHINE').select("*")
    .then(data => {
		//Return retrieved data as JSON format
		res.json({
			"message":"success",
			"data":data
		});
	}).catch((err) => { console.log( err); throw err });
});

//GET API to retrieve data for all transactions conducted.
app.get("/api/sales",passport.authenticate('basic', { session: false }),requireAdmin(),(req,res,next) =>{
	//Select all from sales
	knex.from('SALES').select("*")
    .then(data => {
		//Return retrieved data as JSON format
		res.json({
			"message":"success",
			"data":data
		});
	}).catch((err) => { console.log( err); throw err });
});

app.get("/api/items",passport.authenticate('basic', { session: false }),requireAdmin(),(req,res,next) =>{
	//Select all from items
	knex.from('ITEMS').select("*")
    .then(data => {
		//Return retrieved data as JSON format
		res.json({
			"message":"success",
			"data":data
		});
	})
	.catch((err) => { console.log( err); throw err });
});

app.get("/api/inventory",passport.authenticate('basic', { session: false }),requireAdmin(),(req,res,next) =>{
	//Select all from inventory
	knex.from('INVENTORY').select("*")
    .then(data => {
		//Return retrieved data as JSON format
		res.json({
			"message":"success",
			"data":data
		});
	}).catch((err) => { console.log( err); throw err });
});
//
//
// End of API calls //
//
//

// Default response for any other request
app.use(function(req, res){
    res.status(404).send("Not found");
});
