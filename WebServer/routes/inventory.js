const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const router = express.Router();
const knex = require("../db");

const CONFIG = require("../config");

router.get('/',
  (req, res) => {
    knex('INVENTORY').select("*")
    .then(data => {
		//Return retrieved data as JSON format
		return res.status(200).json({
			"message":"success",
			"data":data
		});
    }).catch((err) => {
        console.log(err);
        return res.status(400).send({ error: 'Failed to get inventory' });
    });
  });
  
 module.exports = router;
