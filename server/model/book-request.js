
var mongoose = require('mongoose');

var bookRequest = new mongoose.Schema({
                        user_id :{
                          type: String,
                          required: true
                        },
                        book_id: {
                          type: String,
                          required: true
                        }
});

bookRequest.methods.createBookRequest = function(callback) {
  var request = this;
   this.save().then((record) => {
      callback(null, record);
  }, (err) => {
      callback("Book requested did not created");
  });
};


var BookRequest = mongoose.model('bookRequest', bookRequest);
module.exports = {
  BookRequest: BookRequest
};
