const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const knex = require("../db");

const CONFIG = require("../config");

router.get("/", (req, res) => {
  knex("MACHINE")
    .select("*")
    .then(data => {
      //Return retrieved data as JSON format
      return res.status(200).json({
        message: "success",
        data: data
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(400).send({ error: "Failed to get machine" });
    });
});

router.get("/:machineId/inventory", (req, res) => {
  //Get items available via machine ID
  knex
    .from("INVENTORY")
    .select("*")
    .innerJoin("ITEMS", "INVENTORY.item_id", "ITEMS.item_id")
    .where("INVENTORY.machine_id", req.params.machineId)
    .then(data => {
      res.status(200).json({
        message: "success",
        data: data
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(400).send({ error: "Failed to get machine" });
    });
});

router.post("/startup", (req, res) => {
  //Update the new values on every machine new startup
  knex("MACHINE")
    .select("*")
    .where("machine_id", req.body.machine_id)
    .then(data => {
      if (data.length == 0) {
        return res.status(404).send({ error: "Machine not found."});
      }
      knex("MACHINE")
        .where({ machine_id: req.body.machine_id })
        .update({
          latitude: req.body.latitude,
          longtitude: req.body.longtitude,
          ip: req.body.ip
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
      res.status(200).send({ message: "Machine details updated."});
    });
});


router.post(
  "/:machineId/buy",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.body.item_id) {
      return res.status(400).send({ error: "Incorrect item_id received."});
    }
    const quantity = req.body.quantity || 1
    //Experimental test//
    var dgram = require("dgram");

    //Retrieve data from USER, MACHINE and ITEM
    knex("USER")
      .select("*")
      .whereRaw(
        "LOWER(username) LIKE '%' || LOWER(?) || '%' ",
        req.user["username"]
      )
      .then(data => {
        const user_model = data[0];
        if (user_model["price"] == 0) {
          return res.status(400).send({ error: "Insufficient balance"});
        }
        knex("MACHINE")
          .select("*")
          .where("machine_id", req.params.machineId)
          .then(data => {
            const machine_model = data[0];
            if (!machine_model) {
              return res.status(400).send({ error: "Invalid machine_id" });
            }
            knex("ITEMS")
              .select("*")
              .where("item_id", req.body.item_id)
              .then(data => {
                const item_model = data[0];
                if (!item_model) {
                  return res.status(400).send({ error: "Invalid item_id" });
                }
                knex("INVENTORY")
                  .select("*")
                  .where({
                    item_id: req.body.item_id,
                    machine_id: req.params.machineId
                  })
                  .then(data => {
                    if (data.length == 0) {
                      return res.status(400).send({ error: "Out of stock" });
                    }
                    const inventory_model = data[0];
                    if (
                      user_model["balance"] <
                      item_model["price"] * quantity
                    ) {
                      console.log("/buy: User does not have enough money");
                      return res.status(400).send({ error: "Insufficient balance" });
                    }


                    if (
                      inventory_model["quantity"] - quantity < 0
                    ) {
                      console.log("/buy: Not enough inventory");
                      return res.status(400).send({ error: "Not enough items" });
                    }


                    user_model["balance"] -= item_model["price"];
                    inventory_model["quantity"] -= quantity;
                    console.log(
                      "User balance: " +
                        user_model["balance"] +
                        " " +
                        "inventory quantity: " +
                        inventory_model["quantity"]
                    );
                    knex("USER")
                      .where("user_id", user_model["user_id"])
                      .update({
                        balance: user_model["balance"]
                      })
                    knex("INVENTORY")
                      .where({
                        item_id: inventory_model["item_id"],
                        machine_id: inventory_model["machine_id"]
                      })
                      .update({
                        quantity: inventory_model["quantity"]
                      })


                    var client = dgram.createSocket("udp4");
                    client.send(
                      req.body.item_id,
                      0,
                      20,
                      8082,
                      machine_model["ip"],
                      function(err, bytes) {
                        console.log(
                          "/buy: Sent item id to machine ip: " + machine_model["ip"]
                        );
                        client.close();
                      }
                    );
                    res.status(200).send({ message: "Transaction successful."});
                  });
              });
          });
      })
      .catch(error => {
        console.log(error);
        return res.status(400).send({ error });
      });
  }
);

module.exports = router;
