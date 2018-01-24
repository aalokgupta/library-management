
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var bookRequest = new mongoose.Schema({
                        user_id :{
                          type: String,
                          required: true
                        },
                        book_id: {
                          type: String,
                          required: true
                        },
                        book_issued:  {
                          type: Boolean,
                          required: true
                        },
                        issued_book_id: {
                          type: String
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

bookRequest.methods.updateBookIssuedInfo = function(callback) {
  var request = this;
  var issue_id = new ObjectId();
  console.log(request._id, issue_id);
  BookRequest.update({_id: request._id}, {issued_book_id: issue_id, book_issued: true}, function(err, document){
    if(err) {
      console.log("in book db"+err);
      callback(err);
    }
    callback(null, document);
  });
}

bookRequest.statics.getAllIssuedBook = function() {
   return BookRequest.find({book_issued: true}).exec();
}

var BookRequest = mongoose.model('bookRequest', bookRequest);
module.exports = {
  BookRequest: BookRequest
};
