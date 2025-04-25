const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(409).json({message: 'User already exists!'})
  } else {
    users.push({ username: username, password: password });
    return res.status(201).json({message: 'User created'})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params['isbn'];
  return res.status(300).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params['author'];
  const results = Object.fromEntries(
    Object.entries(books).filter(([key, book]) => book.author === author)
  )
  return res.status(300).json(results);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params['title'];
  const results = Object.fromEntries(
    Object.entries(books).filter(([key, book]) => book.title === title)
  )
  return res.status(300).json(results);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params['isbn'];
  const reviews = books[isbn].reviews;
  return res.status(300).json(reviews);
});

module.exports.general = public_users;
