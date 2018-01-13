var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
                name: {
                  type: String,
                  required: true,
                  trim: true,
                  unique: true
                },
                author: {
                  type: String,
                  required: true,
                  trim: true,
                },
                isbn: {
                  type: String,
                  required: true,
                  trim: true,
                  unique: true
                },
                companyid: {
                  type: String,
                  trim: true
                },
                no_of_copy: {
                  type: Number,
                  required: true
                },
                no_of_available_copy: {
                  type: Number,
                  required: true
                }
});

BookSchema.methods.addNewBook = function(book, callback) {
  this.save(book).then((doc) => {
    callback(null, doc);
  }, (err) => {
    console.log(err);
    callback(err);
    // return new Error("Error while adding book into database, check book details");
  });
}

var Book = mongoose.model('Books', BookSchema);
module.exports = {
  Book: Book
};
