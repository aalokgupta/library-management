var listBookApp = angular.
                  module('listBooks').
                  component('listBooks', {
                    templateUrl: '/public/list-books/list-book.html',
                    controller: 'listBookController'
                  });


listBookApp.factory('performRequest', ['$http', function(http){
  var request = {};

  request.get = function(req) {
    // console.log(JSON.stringify(req, undefined, 2));
     return http(req).then((response) => {
      if(200 === response.status) {
            return response.data;
      }
      else {
        console.log("Books details can be not fetched from server ");
      }
    }, (error) => {
        console.log("Books details can be fetched from server "+error);
    });
  }

  request.postmethod = function(req) {
     return http(req).then((response) => {
      if(200 === response.status) {
            console.log("response = "+JSON.stringify(response, undefined, 2));
            return response.data;
      }
      else {
        return response.status;
      }
    }, (error) => {
        return err;
    });
  }


  return request;
}]);
//['$sessionStorage', 'performGetRequest',
                                          // function(sessionStorage, performGetRequest) {

listBookApp.factory('updateBookDetail', function($sessionStorage, performRequest){

  var factory  = {};
  factory.updateBook =  function() {
    console.log("inside updateBookDetail");
   if($sessionStorage.token) {
     console.log($sessionStorage.token);
      // if(sessionStorage.admin)
      //  console.log(sessionStorage.admin);

       var req = {
         method: 'POST',
         url:    '/update/book',
         data: {
                 name: 'Data structure in c'
               },
         headers: {
           "access-x-auth": sessionStorage.token,
           // "admin": sessionStorage.admin
         }
       };
       console.log("req = "+req);
      return performRequest.postmethod(req).then((book) => {
         return book;
       }, (err) => {
          return err;
       });
   }
  }
 return factory;
});

listBookApp.factory('deleteBookDetail', ['$sessionStorage', 'performGetRequest',
                                    function(sessionStorage, performGetRequest) {
    var factory = {};

    factory.deleteBook =  function() {
      if(sessionStorage.token) {
        console.log(sessionStorage.token);
        if(sessionStorage.admin)
          console.log(sessionStorage.admin);
      }
    }
    return factory;
}]);

listBookApp.factory('getAllBooksDetail', ['$sessionStorage' , 'performRequest' ,'$window',
                                          function(sessionStorage, performRequest, window){
console.log("inside get Book Detail");

  var factory = {};
  console.log(sessionStorage.token);
  factory.getBookDetail =  function(){
    var req = {
              method: 'GET',
              url: '/get-all-books',
              admin: sessionStorage.admin,
              headers: {
                    "access-x-auth": sessionStorage.token
              }
            };
    // console.log("getBookDetail", JSON.stringify(req, undefined, 2));
    return performRequest.get(req).then((books) => {
        return books;
    }, (err) => {

    });
    return;
  }

  factory.logout = function() {
   console.log("logout clicked");
   var req = {
     method: 'DELETE',
     url: `/logout`,
     headers: {
       "access-x-auth": sessionStorage.token
       // "admin": $sessionStorage.admin
       }
   };

   return performRequest.get(req).then((success) => {
     sessionStorage.token = "";
     sessionStorage.admin = "";
     console.log("token deleted");
     window.location.href = "/#!/login";
     console.log("user logOut successfully");
     return;
   }, (err) => {
     console.log("err occured while performing logout");
   });
   }


  return factory;
}]);

//
// listBookApp.factory('performLogout', ['$sessionStorage' , '$window', 'performGetRequest',
//                                       function(sessionStorage, win, performGetRequest) {
// var factory = {}
//  factory.logout =  function() {
//   console.log("logout clicked");
//   var req = {
//     method: 'DELETE',
//     url: `/logout`,
//     headers: {
//       "access-x-auth": $sessionStorage.token
//       // "admin": $sessionStorage.admin
//       }
//   }
//   performGetRequest(req);
//   sessionStorage.token = "";
//   sessionStorage.admin = "";
//   console.log("token deleted");
//   win.location.href = "/#!/login";
//   console.log("user logOut successfully");
//   }
// }]);



listBookApp.controller('listBookController', ['$scope', '$location',
                                              '$sessionStorage',
                                              '$http', '$window',
                                               'getAllBooksDetail',
                                               'updateBookDetail',
                                              function($scope, $location,
                                                       $sessionStorage, $http,
                                                       $window,
                                                       getAllBooksDetail, updateBookDetail
                                                        ) {

    /*
      on-click was not working on list-item so making it available on ng-repeat it is defined here
    */
    $scope.right_nav_ref = [ {url: '', name: ''},
                             {url: '', name: "Profile"},
                             {url: '', name: "Logout"}
                        ];

    if($sessionStorage.token) {
      // if(true === $sessionStorage.admin && true === $sessionStorage.isUserLoggedIn) {
         getAllBooksDetail.getBookDetail().then((books) => {
            $scope.books = books;
         }, (err) => {
            $scope.books = {};
            console.log("server is not responding"+err);
         });
      // }
    }
    else {
      console.log("Not authorized user");
      return;
    }

    $scope.onClickUpdate = function(book) {
      console.log("update book click on "+JSON.stringify(book));
      updateBookDetail.updateBook().then((updatedBook) => {
          $scope.books[book] = updatedBook;
      }, (err) => {
          console.log("Book detail can not be updated");
      });
    }

     $scope.onClickLogOutRef = function(item) {
       console.log("onclick logout");
       getAllBooksDetail.logout().then((success) => {
         console.log("user logout successfully");
         $window.location.href = "/#!/login";
       }, (err) => {

       });
     }
    //
  }]);
