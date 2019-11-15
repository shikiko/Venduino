const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const router = express.Router();
const knex = require("../db");

const CONFIG = require("../config");

router.get('/',
  (req, res) => {
    knex('MACHINE').select("*")
    .then(data => {
		//Return retrieved data as JSON format
		return res.status(200).json({
			"message":"success",
			"data":data
		});
    }).catch((err) => {
        console.log(err);
        return res.status(400).send({ error: 'Failed to get machine' });
    });
  });
  
 router.get('/getInventory',
  (req, res) => {
    //Get items available via machine ID
	knex.from('INVENTORY').select("*")
	.innerJoin('ITEMS','INVENTORY.item_id','ITEMS.item_id')
	.where('INVENTORY.machine_id',req.body.machine_id)
	.then(data => {
		res.status(200).json({
			"message":"success",
			"data":data
		});
    }).catch((err) => {
        console.log(err);
        return res.status(400).send({ error: 'Failed to get machine' });
    });
  });
 
router.post("/startup",
	(req, res) => {
		//Update the new values on every machine new startup
		knex('MACHINE').select("*")
		.where('machine_id',req.body.machine_id)
		.then(data =>{
			if(data.length == 0){return res.status(404).send("Machine not found.");}
			knex('MACHINE')
			.where({machine_id: req.body.machine_id})
			.update({
				latitude: req.body.latitude,
				longtitude: req.body.longtitude,
				ip: req.body.ip
			}).catch((err) => { console.log( err); throw err });;
			res.status(200).send("Machine details updated.");
		});
});
 
 module.exports = router;
