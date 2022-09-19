const {getUsers, setUsers} = require("./jsonUserFile.js");
const {generateTokenString, generateTokenExpiry} = require("./token.js");
const {isImageFile, getImageFileName} = require("./fileCheck.js");

const bcrypt = require("bcrypt");
const express = require("express");
const fileUpload = require("express-fileupload");
const bp = require('body-parser')
const path = require("path");
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.post("/api/create", fileUpload({createParentPath: true}), (req, res) => {
  let users = getUsers();

  //missing request data
  if ((!req.body.email) || (!req.body.password)) {
    return res.status(400).json({"msg" : "missing credentials"});
  }

  let email = req.body.email;
  
  //store hash instead of plaintext pass
  let password = req.body.password;
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  //account exists
  if (Object.hasOwn(users, email)) {
    return res.status(400).json({"msg" : "account already exists"});
  }
  //no name in image
  if (!req.files) {
    return res.status(400).json({"msg" : "missing image file"});
  }
  //no content in image
  if (!Object.hasOwn(req.files, "image")) {
    return res.status(400).json({"msg" : "missing image file"});
  }
  const image = req.files.image;
  //if file is not an image
  if (!isImageFile(image)) {
    return res.status(400).json({"msg" : "invalid file type (jpeg or png)"});
  }
  //if file is bigger than 5MB
  let maxSizeMB = 5
  let maxSizeBytes = maxSizeMB * 1000 * 1000
  if (image.size > maxSizeBytes) {
    return res.status(400).json({"msg" : `file size too big (max size of ${maxSizeMB}MB)`});
  }
  
  //generate a unique directory name to put file in
  //Note: with a db you would just incorporate an id
  let timestamp = generateTokenExpiry(0);
  let imageDir = generateTokenString(10) + timestamp;
  while (fs.existsSync('./images/' + imageDir)) imageDir = generateTokenString(10) + timestamp;
  const imagePath = path.join('./images/', imageDir, image.name);
  image.mv(imagePath);
  let user = {
    "password": hash,
    "imagePath": imagePath
  };

  users[email] = user;
  setUsers(users);
  return res.json({"created": 1, "msg": "account created"});

});

app.post("/api/login", (req, res) => {
  let users = getUsers();

  //missing request data
  if ((!req.body.email) || (!req.body.password)) {
    return res.status(400).json({"msg" : "missing credentials"});
  }

  let email = req.body.email;
  let password = req.body.password;

  //if there is not a user with the email
  if (!Object.hasOwn(users, email)) {
    return res.status(400).json({"msg" : "invalid credentials"});
  }
  let user = users[email];
  //if the passsword does not belong to the email
  if (!bcrypt.compareSync(password, user["password"])) {
    return res.status(400).json({"msg" : "invalid credentials"});
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

app.post("/api/image", (req, res) => {
  let users = getUsers();

  //missing request data
  if ((!req.body.email) || (!req.body.tokenString)) {
    return res.status(400).json({"msg" : "missing credentials"});
  }

  let email = req.body.email;
  let tokenString = req.body.tokenString;

 
  //if there is not a user with the email
  if (!Object.hasOwn(users, email)) {
    return res.status(400).json({"msg" : "invalid credentials"});
  }
  let user = users[email];
  //if the user does not have a token
  if (!Object.hasOwn(user, "token")) {
    return res.status(400).json({"msg" : "invalid credentials"});
  }
  //if the token does not belong to the email
  if (user.token.string != tokenString) {
    return res.status(400).json({"msg" : "invalid credentials"});
  }
  const imagePath = user.imagePath;
  if (!fs.existsSync(imagePath)) {
    return res.status(500).json({"msg" : "cannot find image file"});
  }

  //must be full path
  return res.sendFile(path.resolve(imagePath));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});