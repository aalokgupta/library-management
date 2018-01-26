
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
    newAdmin.save().then((user) => {
       console.log("user saved into database "+user);
       newAdmin.generateAuthTokens(function(err, token){
        if(err){
          console.log("error while generating auth "+err);
          res.status(400).send();
        }
        //#################### only for testing need to remove########################
        newAdmin.removetoken(token);
        //#################### only for testing need to remove########################

        res.header('access-x-auth', token);
        res.header('admin', body.admin);
        res.header('user_id', user._id);
        console.log("user save into db and generated token is "+token);
        res.status(200).send(); // need to redirect to admin dashboard
      });
    }).catch( (err) => {
      console.log("error while writing user data into db"+err);
    });
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
      // Admin.findBytoken(req.header("access-x-auth")).then((user) => {
      //   console.log("token from header = "+req.header("access-x-auth"))
      //   res.header("access-x-auth", user.tokens[0].token);
      //   res.header('admin', user.admin);
      //   res.status(200).send();
      // }).catch((err) => {
      //   res.status(401).send();
      // });

      Admin.findByCredentials(body.email, body.password).then((user) => {
        console.log("user found = "+user);
        user.generateAuthTokens(function(err, token) {
          if(err) {
              res.status(401).send();
              res.end();
          }
          console.log("token generated");
          res.header('access-x-auth', token);
          res.header('admin', body.admin);
          res.header('user_id', user._id);
          res.status(200).send();
        });
      }).catch(() => {
          res.status(401).send();
      });
  });


  app.post('/update-book', authenticateUser, function(req, res){

    var body = _.pick(req.body.book, ['name', 'author', 'isbn', 'companyid', 'no_of_copy']);
    Book.updateBookDetail(req.body.book.book_id, body, function(err, numOfBook){
      if(err) {
        res.status(400).send({error: err});
      }
      console.log("book detail has been updated");
      res.status(200).send();
    });
  });


  app.delete('/logout', authenticateUser, function(req, res){
    if(!req.user){
      console.log("user token removed from db");
      res.status(400).send();
    }
    req.user.removetoken(req.token).then(() => {
      res.status(200).send();
    }, () => {
      console.log("error occured while removing token from database");
    });
  });

  app.get('/get-all-books', function(req, res){
    Book.find({}).then((books) => {
      // console.log("books received = "+JSON.stringify(books));
      res.send(books);
      res.end();
    }, (err) => {
      res.status(401).send({});
    });
  });


   app.post('/add-book', authenticateUser, function(req, res){
     var body = _.pick(req.body, ['name', 'author', 'isbn', 'companyid', 'no_of_copy']);
     body["no_of_available_copy"] = body["no_of_copy"];
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
     new_request.createBookRequest(function(err, response){
       if(err) {
         res.status(400).send({error: err});
       }
       console.log(response);
       res.status(200).send({success: "request has been sent to admin"});
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
         obj["issued_at"] = requests[request]._id.getTimestamp();
         obj["bookname"] =  results[1].name;
         obj["return_at"] = requests[request]._id.getTimestamp();
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
     console.log(JSON.stringify(req.body));
      var body = _.pick(req.body, ['request_id', 'book_id', 'user_id']);
      console.log("inside accept-book-request "+body.request_id);

      BookRequest.findById({_id: body.request_id}).then((request) => {
        console.log(request);
        request.updateBookIssuedInfo(function(err, result){
          console.log("inside updateBookIssuedInfo");
          if(err) {
            console.log("error while updating book issue info"+err);
          }
          res.status(200).send({issue_id: result.issued_id});
          Book.updateNoOfAvailableBook(body.book_id).then((response) => {
            console.log("book info updtaed"+response);
          });

          Admin.findById(body.user_id).then((user) => {
              var info = {book_id: book_id, issued_id: result.issued_id};
              user.updateIssuedBookInfo(info, function(err, user){
                if(err) {
                  console.log(err);
                }
                console.log(user);
              });
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
            obj = book;
            obj["issued_at"] = request.issued_at;
            var day = moment(request.issued_at);
            console.log("after 30 days = "+moment(request.issued_at).add(30, 'days'));
            console.log("day = "+day);
            // obj["return_date"] = moment(request.issued_at) + request.return_duration;
            issued_book.push(book);
            if(--no_of_request === 0) {
              res.status(200).send(issued_book);
            }
          }, (err) => {
              res.status(401).send(err);
          });
       });
      });

        //   findBookName(request.book_id).then((book) => {
        //    // console.log("book "+book);
        //     issued_book.push(book);
        //     console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$no_of_request = "+no_of_request);
        //     if(--no_of_request === 0) {
        //       console.log("no of book sent = "+issued_book);
        //       res.status(200).send(issued_book);
        //     }
        //   }, (err) => {
        //     console.log(err);
        //     res.status(400).send(err);
        // });
      // });
        // console.log("no of element = "+cursor.count());



       // cursor.on('close', function(){
       //   console.log("cursor close");
       // });
       // // console.log("requests "+requests);
       // var no_of_request = requests.length;
       // // console.log("no_of_request "+no_of_request);
       // var issued_book = [];
       //
       // requests.forEach(function(err, request) {
       //   console.log("")
       //   console.log("####### "+requests[request]);
       //   if(err) {
       //     throw new Error(err);
       //   }



       // });
   });
};

module.exports = {
  routesHandler: routesHandler
};
