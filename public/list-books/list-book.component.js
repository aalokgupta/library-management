
var listBookApp = angular.
                  module('listBooks').
                  component('listBooks', {
                    templateUrl: '/public/list-books/list-book.html',
                    controller:  'listBookController'
                  });

listBookApp.factory('updateBookDetail', function($sessionStorage, BookInfo){

  var factory  = {};
  factory.updateBook =  function(book) {
    console.log("inside updateBookDetail");
   if($sessionStorage.token) {
     console.log($sessionStorage.token);
     console.log("****Book Name = ", book.name);
     BookInfo.setBookName(book.name);
     BookInfo.setAuthorName(book.author);
     BookInfo.setNoOfCopy(book.no_of_copy);
     BookInfo.setNoOfAvailabeCopy(book.no_of_available_copy);
     BookInfo.setCompanyId(book.company_id);
     BookInfo.setISBN(book.isbn);
     BookInfo.setBookId(book._id);
   }
  }
 return factory;
});

listBookApp.factory('deleteBookDetail',
                                    function($sessionStorage, request) {
    var factory = {};

    factory.deleteBook =  function(id) {
      if($sessionStorage.token) {
        console.log($sessionStorage.token);
        if($sessionStorage.admin) {
          console.log($sessionStorage.admin);

          var req = {
                      method: 'POST',
                      url: `/delete-book`,
                      headers: {
                        "access-x-auth": $sessionStorage.token,
                        "admin": $sessionStorage.admin,
                        "user_id": $sessionStorage.user_id
                      },
                      data: {
                        book_id: id
                    }
                  };
                  console.log("delete req = "+JSON.stringify(req));
          return request.postmethod(req).then((response) => {
              return response;
          }, (err) => {
            return err;
          });
          }
        }
    }
    return factory;
});

listBookApp.factory('getAllBooksDetail', ['$sessionStorage' , 'request' ,'$window',
                                          function(sessionStorage, request, window){
  var factory = {};
  factory.getBookDetail =  function() {
    var req = {
              method: 'GET',
              url: '/get-all-books',
              admin: sessionStorage.admin,
              headers: {
                    "access-x-auth": sessionStorage.token
              }
            };
    // console.log("getBookDetail", JSON.stringify(req, undefined, 2));
  return request.getmethod(req).then((books) => {
        return books;
    }, (err) => {

    });
  }
  return factory;
}]);


listBookApp.controller('listBookController', ['$scope',
                                              '$sessionStorage',
                                               '$window',
                                               'getAllBooksDetail',
                                               'updateBookDetail',
                                               'deleteBookDetail',
                                               'BookInfo',
                                               '$parse',
                                              function($scope,
                                                       $sessionStorage,
                                                       $window,
                                                       getAllBooksDetail,
                                                       updateBookDetail,
                                                       deleteBookDetail,
                                                       BookInfo,
                                                       $parse
                                                        ) {


    /*
      on-click was not working on list-item so making it available on ng-repeat it is defined here
    */
    // $scope.right_nav_ref = [{url: '', name: "Logout"}];

    // for(var i = 0; i < books.length; i++) {
    //   var str = books[i].name;
    //   var model = $parse(str);
    //   model.assign($scope, false);
    //   // console.log($scope.name);
    //   // $scope[books.name] = false;
    // }
    if($sessionStorage.token) {
      $scope.isAdminLoggedin = true;
      if("true" === $sessionStorage.admin) {
         getAllBooksDetail.getBookDetail().then((books) => {
            $scope.books = books;
         }, (err) => {
            $scope.books = {};
            $scope.isAdminLoggedin = false;
            console.log("server is not responding"+err);
         });
       }
    }
    else {
      $window.location.href = "#!/all-books";
      console.log("Not authorized user");
      return;
    }

    $scope.onClickUpdate = function(book) {
      console.log("update book click on "+JSON.stringify(book));
      updateBookDetail.updateBook(book.book);
      $scope.myValue = true;
      $window.location.href = "#!/update-book";
    }

     // $scope.onClickLogOut = function(item) {
     //   console.log("onclick logout");
     //   getAllBooksDetail.logout().then((success) => {
     //     console.log("user logout successfully");
     //     $window.location.href = "/#!/login";
     //   }, (err) => {
     //      console.log("server is not responding, unable to logout")
     //   });
     // }

     $scope.onClickDelete = function(book) {
       console.log("onclick delete "+JSON.stringify(book));
       deleteBookDetail.deleteBook(book.book._id).then( (response) => {
         var index = $scope.books.indexOf(book);
         $scope.books.splice(index, 1);
         console.log("book detail has benn deleted from book database "+response);
       }, (err) => {
          console.log(err);
       });
     }
  }]);
