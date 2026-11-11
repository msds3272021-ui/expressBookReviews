const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};
    
// Middleware to authenticate requests to "/customer/login" endpoint
app.use("/customer/login", function auth(req, res, next) {
    // Check if user is logged in and has valid access token
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});


}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Extract isbn parameter from request URL
    const isbn = req.params.isbn;
    const { review } = req.body;
    const existingReview = reviews.find(review => review.isbn === isbn);
  
  if (existingReview) {
    existingReview.review = review; // Modify existing review
    res.send('Existing review has been modified');
  } else {
    reviews.push({ isbn, review }); // Add new review
    res.send('New review has been added');
  }
});
      
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Extract isbn parameter from request URL
    const isbn = req.params.isbn;
    const { username } = req.body;
    const reviewIndex = reviews.findIndex(review => review.isbn === isbn && review.username === username);

    if (reviewIndex !== -1) {
        reviews.splice(reviewIndex, 1);
        res.send(`Book review with the isbn ${isbn} deleted.`);
    } else {
    res.status(404).send('Book review not found'); 
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
