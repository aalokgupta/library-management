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
            admin: {
              type: Boolean,
              required: true
            },
            issued_book: [{
                book_id: {type: String, required: true},
                issued_id: {type: String, required: true},
                return_status: {type: Boolean, required: true},
                return_duration: {type: Number},
            }],
            // tokens: [{
            //   access: {type: String, required: true},
            //   token: {type: String, required: true}
            // }]
            // will include token fot secure login
});

adminSchema.methods.saveNewUser = function(callback) {
   // var user = this;
  // var access = 'auth';
  // user.tokens.push({access, token});
  this.save().then((user) => {
        // console.log("inside writing token"+document);
      var token = user.generateAuthTokens();
      callback(null, {token: token, user_id: user._id});
  }).catch((err) => {
    console.log("error while save user informatin "+err);
  });
}

adminSchema.methods.generateAuthTokens = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  return token;
  // user.tokens.push({access, token});
  // user.save().then((document) => {
  //     // console.log("inside writing token"+document);
  //     callback(null, token);
  // }).catch((err) => {
  //   console.log("error while save user informatin "+err);
  // });
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

adminSchema.statics.findBytoken = function(token, callback){
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

  User.findOne({
  '_id': decoded._id,
  'tokens.token': token,
  'tokens.access': 'auth'
  }, function(err, user){
      if(err) {
        return callback(err, null);
      }
      console.log("User found ");
      return callback(null, user);
    });
}


adminSchema.statics.updateIssuedBookInfo = function(info, callback) {
  console.log("inside updateIssuedBookInfo");

  var user = this;
  var book_id =  info.book_id;
  var issued_id = info.issued_id;
  var return_status = false;
  var return_duration = 30;

  var issued_book_info = {book_id: info.book_id, issued_id: info.issued_id,
                          return_status: return_status, return_duration: return_duration};

  Admin.update({_id: info.user_id}, {$push: {issued_book: issued_book_info} }, {new: true}, function(err, user) {
      if(err) {
        console.log("error while saving user" +err);
        callback(err);
      }
      console.log("Book Issued information has been updated for user "+user);
       callback(null);
    });

}

adminSchema.methods.getAllIssuedBook = function(callback) {
  var user = this;

  // user.find({'issued_book.return_status': false}, {'issued_book.book_id'})
  user.find( { "issued_book.return_status": false}).then( (books) => {
    console.log(books);
    return books;
  }, (err) => {
      console.log(err);
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
