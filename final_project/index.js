const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Middleware to authenticate requests to "/customer/login" endpoint
//index.js should contain the authentication middleware that verifies the token
//It checks whether a session contains an access token, verifies the JWT, and allows the request to continue only when the token is valid.
//The authentication flow is:

//The user logs in.
//The access token is stored in req.session.authorization.accessToken.
//This middleware retrieves the token.
//jwt.verify() validates it.
//next() allows the authenticated route to run.

app.use("/customer/auth/*", function auth(req, res, next) {
  // Check whether the user has a session authorization object
  if (!req.session.authorization) {
    return res.status(403).json({
      message: "User not logged in"
    });
  }

  const token = req.session.authorization.accessToken;

  // The secret must match the secret used when the JWT was created
  jwt.verify(token, "access", function (err, user) {
    if (err) {
      return res.status(403).json({
        message: "User not authenticated"
      });
    }

    // Make the decoded user information available to later routes
    req.user = user;
    next();
  });
});


const PORT =5000;

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
