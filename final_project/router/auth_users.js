const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.some(u => u.username === username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user = users.find(u => u.username === username);
  return user.password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username,password} = req.body;
  if (!isValid(username)){
    return res.status(400).json({message: 'Invalid username'});
  } else if (!authenticatedUser(username,password)){
    return res.status(400).json({message: 'Invalid password'});
  }
  const accessToken = jwt.sign({username: username}, 'secret', {expiresIn: 300});
  req.session.authorization = { accessToken, username };
  return res.status(200).send();
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params['isbn']
  const review = req.query['review'];
  const username = req.session.authorization.username
  const book = books[isbn];
  const bookReviews = book.reviews
  bookReviews[username] = review
  return res.status(200).json({message: "Review added"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params['isbn']
  const username = req.session.authorization.username
  const book = books[isbn];
  const bookReviews = book.reviews
  book.reviews = Object.fromEntries(
    Object.entries(bookReviews).filter(([u, content]) => u !== username)
  )
  console.log(book)
  return res.status(200).json({message: "Review removed"});
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
