
const {Admin} = require('../model/admin');
const {Book} = require('../model/book');
const {BookRequest} = require('../model/book-request');
const {authenticateUser} = require('../authenticate/authenticateUser');

const filepath = require('filepath');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


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
      console.log("books received = "+JSON.stringify(books));
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
     var new_request = new BookRequest(body);
     new_request.createBookRequest(function(err, response){
       if(err) {
         res.status(400).send({error: err});
       }
       console.log(response);
       res.status(200).send({success: "request has been sent to admin"});
     });
   });
};

module.exports = {
  routesHandler: routesHandler
};
