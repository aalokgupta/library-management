const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {Admin} = require('./model/admin');
const {Book} = require('./model/book');
const {authenticateUser} = require('./authenticate/authenticateUser');
const bcrypt = require('bcryptjs');

const {routesHandler} = require('./routes/routes-handler');


const app = express();
const port = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost:27017/library-management', () => {
  console.log("mongoose connected to Library Management database");
});

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/client-controller', express.static(process.cwd() + '/client-controller'));
app.use('/script', express.static(process.cwd() + '/script'));

app.use(bodyParser.json());

 routesHandler(app);



app.listen(port, (err) => {
  if(err){
  }
  console.log("server started listening on port no "+port);
})
