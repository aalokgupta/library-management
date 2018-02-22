var {Admin} = require('./../model/admin');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


 var verifyToken = function(token, callback) {
  var secretKey = 'abc123';
  jwt.verify(token, secretKey, function(err, decoded){
    if(err) {
      callback(err);
    }
    callback(null, decoded._id);
  });
}

var authenticateUser = function(req, response, next){
  var received_token = req.header('access-x-auth');
  var user_id = req.header('user_id');
  console.log("user id = "+user_id);
  console.log("token = "+received_token);
  var generated_token = verifyToken(received_token, function(err, id) {
    if(err) {
      console.log("decoded token not generated");
      response.status(401).send({auth: "decoded token not generated"});
      response.end();
    }
    if(id === user_id) {
      next();
    }
    else {
      response.status(401).send({auth: "token did not match"});
      response.end();
    }
    });

  // Admin.findBytoken(token, function(err, user){
  //     if(err) {
  //       console.log("user not found");
  //       response.status(400).send({"auth": "user not found"});
  //       next();
  //     }
  //     req.user = user;
  //     req.token = token;
  //     next();
  // });

  // Admin.findBytoken(token).then((user) => {
  //   if(!user){
  //     return Promise.reject();
  //   }
  //   req.user = user;
  //   req.token = token;
  //   next();
  // }, (err) => {
  //   console.log("error while executing findBytoken");
  //   next(err);
  // });
}
module.exports = {authenticateUser};
