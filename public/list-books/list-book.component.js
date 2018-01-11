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

listBookApp.factory('updateBookDetail', function($sessionStorage, BookInfo){

  var factory  = {};
  factory.updateBook =  function(book) {
    console.log("inside updateBookDetail");
   if($sessionStorage.token) {
     console.log($sessionStorage.token);
     BookInfo.setBookName(book.name);
     BookInfo.setAuthorName(book.author);
     BookInfo.setNoOfCopy(book.no_of_copy);
     BookInfo.setNoOfAvailabeCopy(book.no_of_available_copy);
     BookInfo.setCompanyId(book.company_id);
     BookInfo.setISBN(book.isbn);
   }
  }
 return factory;
});

listBookApp.factory('deleteBookDetail', ['$sessionStorage', 'performRequest',
                                    function(sessionStorage, performRequest) {
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



listBookApp.controller('listBookController', ['$scope',
                                              '$sessionStorage',
                                               '$window',
                                               'getAllBooksDetail',
                                               'updateBookDetail',
                                               'deleteBookDetail',
                                               'BookInfo',
                                              function($scope,
                                                       $sessionStorage,
                                                       $window,
                                                       getAllBooksDetail,
                                                       updateBookDetail,
                                                       deleteBookDetail,
                                                       BookInfo
                                                        ) {

    /*
      on-click was not working on list-item so making it available on ng-repeat it is defined here
    */
    $scope.right_nav_ref = [{url: '', name: "Logout"}];

    if($sessionStorage.token) {
      $scope.isAdminLoggedin = true;
      // if(true === $sessionStorage.admin && true === $sessionStorage.isUserLoggedIn) {
         getAllBooksDetail.getBookDetail().then((books) => {
            $scope.books = books;
         }, (err) => {
            $scope.books = {};
            $scope.isAdminLoggedin = false;
            console.log("server is not responding"+err);
         });
      // }
    }
    else {
      $window.location.href = "#!/all-books";
      console.log("Not authorized user");
      return;
    }

    $scope.onClickUpdate = function(book) {
      console.log("update book click on "+JSON.stringify(book));
      updateBookDetail.updateBook(book);
      $window.location.href = "#!/update-book";
    }

     $scope.onClickLogOut = function(item) {
       console.log("onclick logout");
       getAllBooksDetail.logout().then((success) => {
         console.log("user logout successfully");
         $window.location.href = "/#!/login";
       }, (err) => {
          console.log("server is not responding, unable to logout")
       });
     }


     $scope.onClickDelete = function(item) {
       cosole.log("onclick delete");
       // deleteBookDetail.deleteBook()
     }
    //
  }]);
