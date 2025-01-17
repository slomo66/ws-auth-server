const express = require(`express`);
const app = express();
const expressWs = require("express-ws")(app);
const axios = require("axios");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const url = require("url");

const { getTimeAsString, getDateAsString } = require("./misc");
const { fetchUserToken } = require("./user/users");
const {
  testObjects,
  testLanguageList,
  testLanguage_deDe,
  testLanguage_enGB,
  testLanguage_frFr,
} = require("./StoreData/dataObjects");

const port = process.env.PORT || 8080;

const jwtSecret = "example-secret";

let counter = 0;
let isConnected = false;
let timerId = null;

// Helper-Functions

const clearTimer = () => {
  isConnected = false;
  clearTimeout(timerId);
  timerId = false;
};

const getObjectsByTopic = (topics = []) => {
  let arr = [];
  console.log("topics:", topics);

  topics.map((topic) => {
    testObjects.map((obj) => {
      if (obj.topics.includes(topic)) {
        const tmp = { ...obj, topics: topic };
        arr.push(tmp);
      }
    });
  });

  return arr;
};

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
app.ws("/ws", (ws, req) => {
  const timestamp = Date.now();
  const time = getTimeAsString(0, timestamp);

  console.log("Client connected");

  isConnected = true;

  let token = url.parse(req.url, true).query.token;

  console.log(token);

  let wsUsername = "";

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      ws.close();
    } else {
      wsUsername = decoded.username;
      console.log("Login:", wsUsername);

      //   setTimeout(() => {
      //     testData(), 500;
      //   });
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clearTimer();
  });

  ws.on("error", (err) => {
    console.log("Some Error occurred");
    clearTimer();
  });

  // callback mit webSocketR2
  // https://github.com/ModernEdgeSoftware/WebSocketR2/blob/master/example/server.js

  ws.on("message", (msg) => {
    // erwartete msg:
    // 1. ohne Callback => { data: { id, mode, section, usw...} }
    // 2. mit Callback  => { cbId, data: { args...} }

    try {
      const jsonObj = JSON.parse(msg);
      if (jsonObj.data == null || jsonObj.data == undefined) return;

      console.log("onMessage", jsonObj);

      const { cbId } = jsonObj;
      const { id, mode, topics, section } = jsonObj.data;

      if (cbId != null && cbId != undefined) {
        const response = {
          cbId: cbId,
          data: { accountId: 1234 },
        };
        sendData(response);
        return;
      }

      //
      if (mode === "getLanguageList") {
        sendData({
          section: section,
          mode: mode,
          data: [...testLanguageList],
        });
      }

      if (mode === "getLanguageText") {
        let resObj = { section: section, mode: mode, data: null };
        if (jsonObj.data.value === "de-DE") {
          resObj.data = { ...testLanguage_deDe };
        }
        if (jsonObj.data.value === "en-GB") {
          resObj.data = { ...testLanguage_enGB };
        }
        if (jsonObj.data.value === "fr-FR") {
          resObj.data = { ...testLanguage_frFr };
        }

        sendData(resObj);
      }

      if (mode === "getValue") {
        console.log(jsonObj);
        //cb(JSON.stringify({ msg: "test" }));
      }
      //
      if (mode === "getTopics") {
        const res = getObjectsByTopic(topics);
        sendData({
          timestap: Date.now(),
          section: section,
          data: [...res],
        });
      }
    } catch (error) {
      sendData({ error: error });
      console.log(error);
    }

    // console.log(time, ": Received message from client: " + msg);
    // lastMsg = msg;
    // ws.send(`${time} : Someone said: ${msg}`);
  });

  const sendData = (msg = {}) => {
    ws.send(JSON.stringify({ ...msg }));
    console.log("send:", { ...msg });
  };
});

// ==================================================================

app.listen(port, () => {
  console.log("Server started on port", port);
});
