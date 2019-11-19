var express = require("express");
var bodyParser = require("body-parser");
const passport = require("passport");
const Cors = require("cors");

var CONFIG = require("./config");
var user = require("./routes/user");
var machine = require("./routes/machine");
var item = require("./routes/item.js");
var sales = require("./routes/sales.js");
var inventory = require("./routes/inventory.js");

require("./passport");

var app = express();

app.use(Cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

const logger = function (req, res, next) {
  console.log((new Date()).toISOString(), req.method, req.originalUrl, req.params)
  next()
}

app.use(logger)

app.use("/api/user", user);
app.use(
  "/api/machine",
  passport.authenticate("jwt", { session: false }),
  machine
);
app.use("/api/item", passport.authenticate("jwt", { session: false }), item);
app.use(
  "/api/inventory",
  passport.authenticate("jwt", { session: false }),
  inventory
);
app.use("/api/sales", passport.authenticate("jwt", { session: false }), sales);

// Default response for any other request
app.use(function(req, res) {
  res.status(404).send({ error: "API Not found"});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res
    .status(err.status || 500)
    .send(req.app.get("env") === "development" ? err : err);
});

// Start server
const PORT = process.env.PORT || CONFIG.HTTP_PORT || 8080
app.listen(PORT, () => {
  console.log(
    "Server running on port %PORT%".replace("%PORT%", PORT)
  );
  const ifaces = require('os').networkInterfaces();
  Object.keys(ifaces).forEach(dev => {
    ifaces[dev].filter(details => {
      if (details.family === 'IPv4' && details.internal === false) {
        // address = details.address;
        console.log(`Local IP: http://${details.address}:${PORT}`)
      }
    });
  });

});

module.exports = app;
