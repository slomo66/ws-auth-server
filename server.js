const express = require(`express`);
const app = express();
const expressWs = require("express-ws")(app);
const axios = require("axios");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { getTimeAsString, getDateAsString } = require("./misc");
const { fetchUserToken } = require("./user/users");

const port = process.env.PORT || 8080;

const jwtSecret = "example-secret";

// ==================================================================
// Webserver
// ==================================================================
app.use(cors());

app.get("/", (req, res) => {
  const timestamp = Date.now();
  const date = getDateAsString(2, timestamp);

  res.json(`${date} => slomo's channel`);
});

app.get("/auth", (req, res) => {
  res.send(fetchUserToken(req));
});

// ==================================================================
// WebSocket
// ==================================================================
app.ws("/", (ws, req) => {
  const timestamp = Date.now();
  const time = getTimeAsString(0, timestamp);

  console.log("A client just connected");

  ws.on("message", function (msg) {
    console.log(time, ": Received message from client: " + msg);

    lastMsg = msg;

    ws.send(`${time} : Someone said: ${msg}`);
  });
});

// ==================================================================

app.listen(port, () => {
  console.log("Server started on port", port);
});
