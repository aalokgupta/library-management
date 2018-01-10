var {Admin} = require('./../model/admin');
var _ = require('lodash');
var bcrypt = require('bcryptjs');

var authenticateUser = function(req, response, next){
  var token = req.header('access-x-auth');
  // console.log("token = "+token);
  Admin.findBytoken(token, function(err, user){
      if(err) {
        console.log("user not found");
        response.status(400).send({"auth": "user not found"});
        next();
      }
      req.user = user;
      req.token = token;
      next();
  });

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
