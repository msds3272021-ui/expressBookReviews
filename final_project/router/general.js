const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  const bookKeys = Object.keys(books);

  for (let i = 0; i < bookKeys.length; i++) {
    const book = books[bookKeys[i]];

    if (book.author === author) {
      booksByAuthor.push(book);
    }
  }

  res.send(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];

  const bookKeys = Object.keys(books);

  for (let i = 0; i < bookKeys.length; i++) {
    const book = books[bookKeys[i]];

    if (book.title === title) {
      booksByTitle.push(book);
    }
  }

  res.send(booksByTitle);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const matchingReviews = reviews.filter(function (review) {
    return review.isbn === isbn;
  });

  res.send(matchingReviews);
});

module.exports.general = public_users;
