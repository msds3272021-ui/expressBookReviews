const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//write code to check is the username is valid
const isValid = (username) => {
  const usersWithSameName = users.filter((user) => {
    return user.username === username;
  });

  return usersWithSameName.length > 0;
};

if (isValid(username)) {
  return res.status(409).json({
    message: "Username already exists"
  });
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};
    
//only registered users can login
//the flow is:

//1.auth_users.js creates the JWT during login.The token is saved in the session.
//2.index.js retrieves and verifies that token for protected routes

//theere are two JWT statements belong in different files:

//1. jwt.sign() — in router/auth_users.js. Add it inside the login route, after confirming that the username and password are valid. The lab’s login endpoint is:
// /customer/login

//2. jwt.verify() — in index.js. Add it inside the authentication middleware provided in index.js: index.js already imports JWT in the lab structure: const jwt = require("jsonwebtoken");

//he secret must match in both files:
//jwt.sign(payload, "access");   -  in router/auth_users.js
//jwt.verify(token, "access", callback);  - in index.js
//So, create the token during login in auth_users.js, then verify it for protected routes in index.js.

router.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // Replace this with the user validation required by your lab
  const user = users.find(
    user => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid username or password"
    });
  }

  const accessToken = jwt.sign(
    { username: username },
    "access",
    { expiresIn: "1h" }
  );

  req.session.authorization = {
    accessToken: accessToken
  };

  res.status(200).json({
    message: "User successfully logged in",
    accessToken: accessToken
  });
});

// Add a book review only is review was initially done by same username
//The important change is this condition:
//review.isbn === isbn && review.username === username
//This ensures that:
//The same user updating the same ISBN modifies their existing review.
//A different user reviewing the same ISBN gets a separate review.
//The username is taken from the authenticated user, rather than trusting a username sent in the request body.
//     constant username= req.user.username (set by JWT authentication middleware),  instead of req.user.body. (which allows users to impersonate another user)

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewText = req.body.review;

  // The username should come from the authenticated session/token
  const username = req.user.username;

  const existingReview = reviews.find(
    (review) =>
      review.isbn === isbn &&
      review.username === username
  );

  if (existingReview) {
    existingReview.review = reviewText;

    return res.send("Existing review has been modified");
  }

  reviews.push({
    isbn: isbn,
    username: username,
    review: reviewText
  });

  res.send("New review has been added");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  const reviewIndex = reviews.findIndex(
    (review) =>
      review.isbn === isbn &&
      review.username === username
  );

  if (reviewIndex !== -1) {
    reviews.splice(reviewIndex, 1);

    return res.send(`Book review with the isbn ${isbn} deleted.`);
  }

  return res.status(404).send("Book review not found");
});
      
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
