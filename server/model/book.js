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

BookSchema.statics.updateBookDetail = function(book_id, book_info, callback) {
  console.log("book_info"+JSON.stringify(book_info));
  Book.findBookById(book_id).then((book) => {
  console.log("book found = "+book);
  var no_of_book_issued = parseInt(book.no_of_copy) - parseInt(book.no_of_available_copy);
  if(parseInt(book_info.no_of_copy) < no_of_book_issued) {
        return callback("No of book can not be updated, it has already issued the available book and no_of_copy can not be less than that");
  }
  else {
        var diff =  parseInt(book_info.no_of_copy) - parseInt(book.no_of_copy);
        console.log("book differenece = "+diff);
        Book.update({_id: book_id}, { $set: book_info,
                                      $inc: {no_of_available_copy: diff}
                                   }, function(err, noOfBook){

                                      if(err) {

                                        callback(err);
                                      }
                                      callback(null, noOfBook);
                                   });
  }
  }, (err) => {
    console.log(err);
      callback(err);
  });
}

BookSchema.statics.getNoOfAvailableBook = function(book_id, callback) {
  Book.findById({_id: book_id}, {no_of_available_copy: 1, _id: 0}).then((res) => {
    callback(null, res["no_of_available_copy"]);
  }, (err) => {
      callback(err);
  });
}

BookSchema.statics.findBookById = function(book_id) {
  console.log("book_id = "+book_id);
  return Book.findById({_id: book_id}).then((book) => {
      // console.log("book found "+book);
      return book;
  }, (err) => {
      return err;
  });
}

BookSchema.statics.deleteBookById = function(book_id, callback) {
  Book.findBookById(book_id).then((book) => {
    book.remove().then((result) => {
      console.log("book removed = "+book);
      callback(null, result);
    }, (err) => {
      callback(`Book can not be removed having id = ${book_id}`);
    });
  }, (err) => {
      callback(`Book can not be find having id = ${book_id}`);
  });
}

BookSchema.statics.updateNoOfAvailableBook = function(book_id) {
  return Book.update({_id: book_id}, {$inc: {no_of_available_copy: -1}}).exec();
}

BookSchema.pre('remove', function(next){
  console.log("check the no_of_copy of book is equal to no_of_available_copy then only delete the book");
  next();
});


var Book = mongoose.model('Books', BookSchema);
module.exports = {
  Book: Book
};
