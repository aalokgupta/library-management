const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var adminSchema = new mongoose.Schema({
            email: {
              type: String,
              required: true,
              trim: true,
              unique: true
            },
            password: {
              type: String,
              required: true,
              minlength: 6,
              trim: true
            },
            username: {
              type: String,
              required: true,
              minlength: 4,
              trim: true
            },
            tokens: [{
              access: {type: String, required: true},
              token: {type: String, required: true}
            }]
            // will include token fot secure login
});


adminSchema.methods.generateAuthTokens = function(callback) {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  user.tokens.push({access, token});
  user.save().then(() => {
      console.log("inside writing token");
      callback(null, token);
  }).catch((err) => {
    console.log("error while save user informatin "+err);
  });
}

adminSchema.pre('save', function(next){
  var user = this;
  console.log("inside pre middleware");
  if(user.isModified('password')){
    console.log("inside if in mongoose middleware");
    bcrypt.genSalt(10, function(err, salt){
      if(err){
        console.log("error generating salt "+err);
        next(err);
      }
      console.log("salt generated "+salt);
      bcrypt.hash(user.password, salt, function(err, hash){
        if(err){
            console.log("error generating hash "+err);
          next(err);
        }
        console.log("hased password generated "+hash);
        user.password = hash;
        next();
      });
    });
  } else {
    console.log("inside else in mongoose middleware ");
    next();
  }
});
adminSchema.statics.findByCredentials = function (email, password) {
  var User = this;
  return User.findOne({email: email}).then((user) => {
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      console.log(`${password}  ${user.password}`);
      bcrypt.compare(password, user.password, function(err, res){
        console.log("user not found");
        if(true === res){
          console.log("user found");
          resolve(user);
        }
        reject();
      });
    });
  });
};

adminSchema.statics.findBytoken = function(token){
  var User = this;
  var decoded;
  try{
    decoded = jwt.verify(token, 'abc123');
  } catch(err){
    return new Promise((resolve, reject) => {
      console.log("token did not verified");
      reject(err);
    });
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

adminSchema.methods.removetoken = function(token){
  var user = this;
  return user.update({
    $pull: {
      tokens: {
        token: token
    }
  }
  });
}

var Admin = mongoose.model('Admin', adminSchema);

module.exports = {
  Admin: Admin
};
