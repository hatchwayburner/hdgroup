const {getUsers, setUsers} = require("./jsonUserFile.js");
const {generateTokenString, generateTokenExpiry} = require("./token.js");
const {isImageFile} = require("./fileCheck.js");

const bcrypt = require("bcrypt");
const express = require("express");
const bp = require('body-parser')
const {sizeof} = require('sizeof')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.post("/create", (req, res) => {
  let users = getUsers();

  //missing request data
  if ((!req.body.email) || (!req.body.password) || (!req.body.image)) {
    return res.json({"msg" : "missing credentials"});
  }

  let email = req.body.email;
  let password = req.body.password;
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  let image = req.body.image;

  //account exists
  if (Object.hasOwn(users, email)) {
    return res.json({"msg" : "account already exists"});
  }
  //no name in image
  if (!Object.hasOwn(image, "name")) {
    return res.json({"msg" : "no image filename"});
  }
  //no content in image
  if (!Object.hasOwn(image, "content")) {
    return res.json({"msg" : "no image content"});
  }
  //if file is not an image
  if (!isImageFile(image.name)) {
    return res.json({"msg" : "invalid file type (jpg or png)"});
  }
  //if file is bigger than 20MB
  if (sizeof(image) > 20000000) {
    return res.json({"msg" : "file size too big"});
  }

  let user = {
    "password": hash,
    "image": {
      "name": image.name,
      "content": image.content
    }
  };
  users[email] = user;
  setUsers(users);
  return res.json({"created": 1, "msg": "account created"});
});

app.post("/login", (req, res) => {
  let users = getUsers();

  //missing request data
  if ((!req.body.email) || (!req.body.password)) {
    return res.json({"msg" : "missing credentials"});
  }

  let email = req.body.email;
  let password = req.body.password;

  //if there is not a user with the email
  if (!Object.hasOwn(users, email)) {
    return res.json({"msg" : "invalid credentials"});
  }
  let user = users[email];
  //if the passsword does not belong to the email
  if (!bcrypt.compareSync(password, user["password"])) {
    return res.json({"msg" : "invalid credentials"});
  }

  //long ass token to prevent brute force
  let tokenString = generateTokenString(512);
  //expiry will be one day from today
  let tokenExpiry = generateTokenExpiry(24 * 60 * 60);
  //create token entry for user
  let token = {"string": tokenString, "expiry": tokenExpiry};
  user["token"] = token;

  users[email] = user;
  setUsers(users);
  return res.json({"token": token, "msg" : "sign in successfull"});
});

app.post("/image", (req, res) => {
  let users = getUsers();

  //missing request data
  if ((!req.body.email) || (!req.body.tokenString)) {
    return res.json({"msg" : "missing credentials"});
  }

  let email = req.body.email;
  let tokenString = req.body.tokenString;

  //if there is not a user with the email
  if (!Object.hasOwn(users, email)) {
    return res.json({"msg" : "invalid credentials"});
  }
  let user = users[email];
  //if the user does not have a token
  if (!Object.hasOwn(user, "token")) {
    return res.json({"msg" : "invalid credentials"});
  }
  //if the token does not belong to the email
  if (user.token.string != tokenString) {
    return res.json({"msg" : "invalid credentials"});
  }

  let image = user.image;
  
  return res.json({"image": image, "msg" : "image retrieved"});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});