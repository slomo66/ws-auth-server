const jwt = require("jsonwebtoken");
const { userCredentials } = require("./credentials");

const jwtSecret = "example-secret";

// http://localhost:8080/auth?username=userA&password=example-password-userA
// https://ws-auth-server.onrender.com//auth?username=userA&password=example-password-userA

const fetchUserToken = (req) => {
  let response = "Error: No matching user credentials found.";

  for (let i = 0; i < userCredentials.length; i++) {
    if (
      userCredentials[i].username == req.query.username &&
      userCredentials[i].password == req.query.password
    ) {
      response = jwt.sign(
        {
          sub: userCredentials[i].userId,
          username: req.query.username,
        },
        jwtSecret,
        { expiresIn: 900 } // Expire the token after 15 minutes.
      );

      console.log(response);
      return response;
    }
  }

  console.log(response);

  return response;
};

module.exports = { fetchUserToken };
