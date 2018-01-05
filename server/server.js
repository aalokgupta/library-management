const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {Admin} = require('./model/admin');
const {authenticateUser} = require('./authenticate/authenticateUser');
const bcrypt = require('bcryptjs');


const app = express();
const port = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost:27017/library-management', () => {
  console.log("mongoose connected to Library Management database");
});

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/client-controller', express.static(process.cwd() + '/client-controller'));
app.use('/script', express.static(process.cwd() + '/script'));

app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/public/index.html');
  // res.status(200).send();
});

app.get('/signup', function(req, res) {
  // res.sendFile(process.cwd() + '/public/signup.html');
});

app.get('/admin/login', function(req, res){
  res.sendFile(process.cwd() + '/public/login.html');
});

app.post('/signup', function(req, res){
  var body = _.pick(req.body, ['email', 'password', 'username', 'admin']);
  var req_sec_key = _.pick(req.body, ['admin_secret_key']);

  if(body.admin === true) {
     // admin_secret_key has to be save into db and at the time of need it can be updated
      if(req_sec_key.admin_secret_key !== "abc") {
        res.status(400).send();
        res.end();
      }
  }

  console.log("body "+JSON.stringify(body));
  var newAdmin = new Admin(body);
  newAdmin.save().then((user) => {
     console.log("user saved into database "+user);
     newAdmin.generateAuthTokens(function(err, token){
      if(err){
        console.log("error while generating auth "+err);
        res.status(400).send();
      }
      //#################### only for testing need to remove########################
      newAdmin.removetoken(token);
      //#################### only for testing need to remove########################

      res.header('access-x-auth', token);
      res.header('admin', body.admin);
      console.log("user save into db and generated token is "+token);
      res.status(200).send(); // need to redirect to admin dashboard
    });
  }).catch( (err) => {
    console.log("error while writing user data into db"+err);
  });
});

app.post('/login', function(req, res){
  var body = _.pick(req.body, ['email', 'password', 'admin']);
  if(true === body.admin) {
    var admin_secret_key = _.pick(req.body, ['admin_secret_key']).admin_secret_key
    if( admin_secret_key !== "abc") {
        res.status(400).send({auth: "Not authorise user"});
        res.end();
    }
  }
    // Admin.findBytoken(req.header("access-x-auth")).then((user) => {
    //   console.log("token from header = "+req.header("access-x-auth"))
    //   res.header("access-x-auth", user.tokens[0].token);
    //   res.header('admin', user.admin);
    //   res.status(200).send();
    // }).catch((err) => {
    //   res.status(401).send();
    // });

    Admin.findByCredentials(body.email, body.password).then((user) => {
      user.generateAuthTokens(function(err, token) {
        if(err) {
            res.status(401).send();
            res.end();
        }
        res.header('access-x-auth', token);
        res.header('admin', body.admin);
        res.status(200).send();
      });
    }).catch(() => {
        res.status(401).send();
    });
});

app.post('/update/book/:id', authenticateUser, function(req, res){
  console.log("user authenticated");
  res.status(200).send();
  res.end();
  // Admin.updateBookInfo();
});

app.delete('/logout', authenticateUser, function(req, res){
  if(!req.user){
    console.log("user token removed from db");
    res.status(400).send();
  }
  req.user.removetoken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    console.log("error occured while removing token from database");
  });
});

app.listen(port, (err) => {
  if(err){
  }
  console.log("server started listening on port no "+port);
})
