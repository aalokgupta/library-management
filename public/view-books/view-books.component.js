 var viewBookApp = angular.
                          module('viewBooks').
                          component('viewBooks', {
                            templateUrl: '/public/view-books/view-books.html',
                            controller: 'viewBooksController'
                          });



  viewBookApp.factory('Books', function($sessionStorage, request){

    var factory = {};
    factory.getAllBooks = function() {
      var req = {
        method: 'GET',
        url: '/get-all-books',
        headers: {
          'access-x-auth': $sessionStorage.token,
          'admin': $sessionStorage.admin,
          'user_id': $sessionStorage.user_id
        }
    };

      return request.getmethod(req).then( (books) => {
        console.log("inside then");
          return books;
        }, (err) => {
          console.log("inside reject");
          return err;
        });
  }

    return factory;
  });

  viewBookApp.factory('requestBook', function($sessionStorage, request){

    var factory = {};
    factory.sendRequest = function(user_req) {
      var req = {
        method: 'POST',
        url: '/request-book',
        data: user_req,
        headers: {
          'access-x-auth': $sessionStorage.token,
          'admin': $sessionStorage.admin,
          'user_id': $sessionStorage.user_id
        }
      };
    return new Promise(function(resolve, reject) {
      request.postmethod(req).then((response) => {
        // console.log("response = "+response);
          resolve(response);
        }, (err) => {
           console.log("########"+err);
           reject(err);
        });
    });
  }
    return factory;
  });


 viewBookApp.controller('viewBooksController', function($scope, $sessionStorage,
                                                        Books, requestBook){

    $scope.data = {
      right_nav_ref: {name: "Logout", url: ""}
    };

    if($sessionStorage.token) {
      if("false" === $sessionStorage.admin) {
          Books.getAllBooks().then((books) => {
            console.log(JSON.stringify(books, undefined, 2));
          $scope.books =  books;
        }, (err) => {
            console.log("Can not fetch books from server");
        });
      }
    }

    $scope.onClickLogOut = function() {
      console.log("on click user logout");
    }

    $scope.onClickRequestBook = function(book) {
      if($sessionStorage.token) {
        if("false" === $sessionStorage.admin) {
          var user_req = {
            user_id: $sessionStorage.user_id,
            book_id: book.book._id
          };
          requestBook.sendRequest(user_req).then((response) => {
            console.log("request has been sent to admin");
            console.log(response);
          }, (err) => {
            console.log("server is not responding try after some time");
            console.log(err);
          });
        }
      }
    }

    $scope.onClickSubscribe = function(book) {
      //
    }
 });
