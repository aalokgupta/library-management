
const {Admin} = require('../model/admin');
const {Book} = require('../model/book');
const {BookRequest} = require('../model/book-request');
const {authenticateUser} = require('../authenticate/authenticateUser');

const filepath = require('filepath');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const async = require('async');
const moment = require('moment');

const publicFolder = filepath.create(process.cwd(), 'public');


var routesHandler = function(app) {

  app.get('/', function(req, res){
    console.log("inside root url");
    res.sendFile(publicFolder + '/index.html');
  });

  app.post('/signup', function(req, res){
    var body = _.pick(req.body, ['email', 'password', 'username', 'admin']);
    var req_sec_key = _.pick(req.body, ['admin_secret_key']);

    if(body.admin === true) {
       // admin_secret_key has to be save into db and at the time of need it can be updated
        if(req_sec_key.admin_secret_key !== "abc") {
          res.status(400).send();
          res.end();
        }
    }

    console.log("body "+JSON.stringify(body));
    var newAdmin = new Admin(body);
    // newAdmin.save().then((user) => {
       // console.log("user saved into database "+user);
       newAdmin.saveNewUser(function(err, data) {
       // newAdmin.generateAuthTokens(function(err, token){
        if(err){
          console.log("error while generating auth "+err);
          res.status(400).send();
        }
        //#################### only for testing need to remove########################
        // newAdmin.removetoken(token);
        //#################### only for testing need to remove########################

        res.header('token', data.token);
        res.header('admin', body.admin);
        res.header('user_id', data.user_id);
        console.log("user save into db and generated token is "+data.token);
        res.status(200).send(); // need to redirect to admin dashboard
      });
    // }).catch( (err) => {
    //   console.log("error while writing user data into db"+err);
    // });
  });

  app.post('/login', function(req, res) {
    console.log("/login requested ");
    var body = _.pick(req.body, ['email', 'password', 'admin']);
    if(true === body.admin) {
      var admin_secret_key = _.pick(req.body, ['admin_secret_key']).admin_secret_key
      if( admin_secret_key !== "abc") {
          res.status(400).send({auth: "Not authorise user"});
          res.end();
      }
      console.log("admin log-in");
    }
    console.log("User log-in");

      Admin.findByCredentials(body.email, body.password).then((user) => {
        console.log("user found = "+user);
        var token = user.generateAuthTokens();
        console.log("token generated");
        res.header('access-x-auth', token);
        res.header('admin', body.admin);
        res.header('user_id', user._id);
        res.status(200).send();
      }).catch(() => {
          res.status(401).send();
      });
  });


  app.post('/update-book', authenticateUser, function(req, res){

    var body = _.pick(req.body.book, ['name', 'author', 'isbn', 'companyid', 'no_of_copy']);
    Book.updateBookDetail(req.body.book.book_id, body, function(err, numOfBook){
      if(err) {
        console.log("error while updaing book detail "+err);
        res.status(400).send({error: err});
      }
      console.log("book detail has been updated");
      res.status(200).send();
    });
  });


  app.delete('/logout', authenticateUser, function(req, res){
    // if(!req.user){
    //   console.log("user token removed from db");
    // }
      res.status(200).send({'logout': 'successfully logout'});
    // req.user.removetoken(req.token).then(() => {
    //   res.status(200).send();
    // }, () => {
    //   console.log("error occured while removing token from database");
    // });
  });

  function find_and_filter_book_based_on_issued_requested(books, user_id) {
    let no_of_books = books.length;
    let book_info_to_be_sent = [];
    return new Promise(function(resolve, reject) {
      books.forEach(function(err, book) {
        let requested = false;
        let isIssued = false;
        // console.log(books[book]._id, user_id);
        BookRequest.find({book_id: books[book]._id, user_id: user_id}, function(err, request) {
          if(err) {
            console.log(err);
          }
          // console.log("request.length = "+request.length, request);
          isRequested = request.length > 0 ? true : false;

          /* isIssued is used for filter out the issued book in the client side
          it require change*/
          if(isRequested === true) {
              isIssued =  false;//request.book_issued;
          }

          // console.log("isIssued = "+isIssued);
          book_info_to_be_sent.push({book: books[book], requested: isRequested, issued: isIssued});
          if(--no_of_books === 0) {
            resolve(book_info_to_be_sent);
          }
        });
      });
    });
  }

  app.get('/get-all-books', function(req, res) {
    var user_id = req.header("user_id");
    Book.find({}).then((books) => {
      find_and_filter_book_based_on_issued_requested(books, user_id).then( (book_info_to_be_sent) => {
        res.status(200).send(book_info_to_be_sent);
      }).catch(function(err) {
        res.status(400).send(err);
      });
  });
});


   app.post('/add-book', authenticateUser, function(req, res){
     var body = _.pick(req.body, ['name', 'author', 'isbn', 'companyid', 'no_of_copy']);
     body["no_of_available_copy"] = body["no_of_copy"];
     body["name"] = body["name"].toUpperCase().trim();
     console.log("book body = "+JSON.stringify(body));
     var newBook = new Book(body);
     newBook.addNewBook(body, function(err, book){
       if(err) {
         res.status(401).send(err);
         res.end();
       }
       res.status(200).send(book);
       res.end();
     });
   });

   app.post('/delete-book', authenticateUser, function(req, res){
     console.log("url = "+JSON.stringify(req.body));
     Book.deleteBookById(req.body.book_id, function(err, book){
       if(err) {
         res.status(400).send({error: err});
       }
       res.status(200).send({book: book});
     });
   });


   app.post('/request-book', authenticateUser, function(req, res){
     console.log("url = "+JSON.stringify(req.body));
     var body = _.pick(req.body, ['user_id', 'book_id']);
     body["book_issued"] = false;
     var new_request = new BookRequest(body);
     Book.getNoOfAvailableBook(body['book_id'], function(err, count) {
        if(err) {
          res.status(401).send(err);
        }
        if(0 < count) {
          console.log("count == "+count);
          new_request.createBookRequest(function(err, response){
            if(err) {
              res.status(400).send({error: err});
            }
            console.log(response);
            res.status(200).send({success: "request has been sent to admin"});
          });
        }
        else {
          res.status(400).send("Book not available");
        }
     });
  });

   function findAllPendingRequest() {
     return BookRequest.find({book_issued: false});
   }

   function findAllIssuedRequest() {
     return BookRequest.find({book_issued: true});
   }

   function findUserName(id) {
     return Admin.findById({_id: id}).exec();
   }

   function findBookName(id) {
     return Book.findById({_id: id}).exec();
   }

   function findAllBookRequestByUser(user_id) {
     return BookRequest.find({user_id: user_id, book_issued: false});
   }

   function getUserAndBookInfoFromBookRequest(requests, callback) {
     var book_user_info = [];
     var book_id, user_id;
     var no_of_request = requests.length;
     requests.forEach(function(err, request) {
       var obj = {};
       book_id = requests[request].book_id;
       user_id = requests[request].user_id;
       obj["request_id"] = requests[request]._id;
       obj["user_id"] = user_id;
       obj["book_id"] = book_id;
       Promise.all([findUserName(user_id), findBookName(book_id)]).then((results) => {
         obj["username"] = results[0].username;
         obj["issued_at"] = moment(requests[request]._id.getTimestamp()).format('DD-MM-YYYY');
         obj["bookname"] =  results[1].name;
         obj["return_at"] = moment(requests[request]._id.getTimestamp()).add(requests[request].return_duration, 'days').format('DD-MM-YYYY');
         obj["requested_at"] = moment(requests[request]._id.getTimestamp()).format('DD-MM-YYYY');
         book_user_info.push(obj);
         if(--no_of_request === 0) {
           callback(null, book_user_info);
         }
       }, (err) => {
         callback(err);
       })
     });
   }

   function getPendingRequestDetail(callback) {
     findAllPendingRequest().then((requests) => {
       getUserAndBookInfoFromBookRequest(requests, function(err, pending_request){
         if(err) {
           callback(err);
         }
         console.log("pending_request = "+pending_request);
         callback(null, pending_request);
       });
     }).catch(err => {
        callback(err);
     });
   }

   app.get('/pending-book-request', authenticateUser, function(req, res){
     console.log("url = "+JSON.stringify(req.params));
     console.log("inside pending-book-request");
     getPendingRequestDetail(function(err, response) {
       if(err) {
        res.status(401).send(err);
       }
       res.status(200).send(response);
     });
   });

   app.get('/issued-books', authenticateUser, function(req, res){
     console.log("inside pending-book-request");
     BookRequest.getAllIssuedBook().then((issuedBooks) => {
       getUserAndBookInfoFromBookRequest(issuedBooks, function(err, issued_book) {
         if(err) {
           res.status(401).send({error: err});
         }
         console.log("pending_request = "+issued_book);
         res.status(200).send(issued_book);
       });
     }).catch( err => {
        res.status(401).send({error: err});
     });
   });

   app.post('/accept-book-request', authenticateUser, function(req, res) {
      var body = _.pick(req.body, ['request_id', 'book_id', 'user_id']);
      console.log("inside accept-book-request "+body.request_id);

      BookRequest.findById({_id: body.request_id}).then((request) => {
        request.updateBookIssuedInfo(function(err, issued_id){
          console.log("inside updateBookIssuedInfo");
          if(err) {
            console.log("error while updating book issue info"+err);
          }
          console.log("issued book info = "+issued_id);
          res.status(200).send({issue_id: issued_id});
          Book.updateNoOfAvailableBook(body.book_id).then((response) => {
            console.log("book info updtaed"+response);
          });

          var info = {user_id: body.user_id, book_id: body.book_id, issued_id: issued_id};

          Admin.updateIssuedBookInfo(info, function(err, user){
            if(err) {
              console.log(err);
            }
            console.log("Issued Book Info has been updated into database");
          });
        });
      }).
        catch(err => {
          console.log("inside catch block"+err);
        });
   });

   app.get('/get-issued-books/:user_id', authenticateUser, function(req, res){
     console.log("inside get-issued-book");
     console.log(req.params.user_id);
     var issued_book = [];
     findAllIssuedRequest().then((requests) => {
       var no_of_request = requests.length;
       requests.forEach(function(err, request) {
         var obj = {};
         console.log("no of books = "+requests[request].book_id);
         findBookName(requests[request].book_id).then((book) => {
         obj["name"] = book.name;
         obj["book_id"] = book._id;
         obj["issued_at"] = moment(request.issued_at).format("DD-MM-YYYY");
         obj["return_at"] = moment(request.issued_at).add(30, 'days').format("DD-MM-YYYY");
         issued_book.push(obj);
         if(--no_of_request === 0) {
            res.status(200).send(issued_book);
          }
        }, (err) => {
             res.status(401).send(err);
        });
      });
    });
  });

  app.get('/get-requested-books/:user_id', authenticateUser, function(req, res){
    console.log("inside get-requested-book");
    console.log(req.params.user_id);
    var requested_book = [];
    findAllBookRequestByUser(req.params.user_id).then((requests) => {
      var no_of_request = requests.length;
      requests.forEach(function(err, request) {
        var obj = {};
        console.log("no of books = "+requests[request].book_id);
        findBookName(requests[request].book_id).then((book) => {

          obj["name"] = book.name;
          obj["book_id"] = book._id;
          obj["available_status"] = book.no_of_available_copy > 0 ? true : false;
          obj["requested_at"] = moment(request.requested_at).format("DD-MM-YYYY");

          requested_book.push(obj);
          if(--no_of_request === 0) {
            res.status(200).send(requested_book);
          }
        }, (err) => {
            res.status(401).send(err);
       });
     });
 });
});


};

module.exports = {
  routesHandler: routesHandler
};
