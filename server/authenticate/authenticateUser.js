var {Admin} = require('./../model/admin');
var _ = require('lodash');
var bcrypt = require('bcryptjs');

var authenticateUser = function(req, response, next){
  var token = req.header('x-auth');
  Admin.findBytoken(token).then((user) => {
    if(!user){
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }, (err) => {
    console.log("error while executing findBytoken");
    next(err);
  });
}

module.exports = {authenticateUser};
