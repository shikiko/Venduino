var express = require("express");
var bodyParser = require("body-parser");
const passport = require("passport");
const Cors = require("cors");

var CONFIG = require("./config");
var user = require("./routes/user");
var machine = require("./routes/machine");

require("./passport");

var app = express();

app.use(Cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use("/api/user", user);
app.use("/api/machine", passport.authenticate('jwt', {session: false}), machine);

// Default response for any other request
app.use(function(req, res) {
  res.status(404).send("API Not found");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res
    .status(err.status || 500)
    .send(req.app.get("env") === "development" ? err : err);
});

// Start server
app.listen(CONFIG.HTTP_PORT, () => {
  console.log(
    "Server running on port %PORT%".replace("%PORT%", CONFIG.HTTP_PORT)
  );
});

module.exports = app;
