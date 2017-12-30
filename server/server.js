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

app.get('/admin/signup', function(req, res){
  res.sendFile(process.cwd() + '/public/signup.html');
});

app.get('/admin/login', function(req, res){
  res.sendFile(process.cwd() + '/public/login.html');
});

app.post('/admin/signup', function(req, res){
  var body = _.pick(req.body, ['email', 'password', 'username']);
  console.log("body "+JSON.stringify(body));
  var newAdmin = new Admin(body);
  newAdmin.save().then((user) => {
     console.log("user saved into database "+user);
    newAdmin.generateAuthTokens(function(err, token){
      if(err){
        console.log("error while generating auth "+err);
        res.status(400).send();
      }
      console.log("user save into db and generated token is "+token);
      res.header('x-auth', token);
      res.status(200).send(); // need to redirect to admin dashboard
    });
  }).catch( (err) => {
    console.log("error while writing user data into db"+err);
  });
});

app.post('/admin/login', function(req, res){
  var body = _.pick(req.body, ['email', 'password']);
  Admin.findByCredentials(body.email, body.password).then((user) => {
    user.generateAuthTokens(function(err, token){
      if(err){
          res.status(401).send();
      }
      res.header('x-auth', token);
      res.status(200).send();
    });

  }).catch(() => {
      res.status(401).send();
  });
});

app.delete('/admin/logout', authenticateUser, function(req, res){
  if(!req.user){
    console.log("user token removed from db");
    res.status(400).send();
  }
  req.user.removetoken(req.token).then(() => {
    res.status(200).send();
  });
});

app.listen(port, (err) => {
  if(err){
  }
  console.log("server started listening on port no "+port);
})
