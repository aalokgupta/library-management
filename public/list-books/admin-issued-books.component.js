var issuedBookApp = angular.
                    module('adminIssuedbooks', []).
                    component('adminIssuedbooks', {
                      templateUrl: '/public/list-books/admin-issued-book.html',
                      controller: 'adminIssuedBookController'
                    });

  issuedBookApp.controller('adminIssuedBookController', function($scope, $sessionStorage, issuedBookService){
    console.log("inside issued books");
    if($sessionStorage.token) {
      if("true" === $sessionStorage.admin) {
        issuedBookService.getAllIssuedBook().then((issuedBooks) => {
          console.log("issuedBooks are = "+issuedBooks);
          $scope.issued_books = issuedBooks;
        }, (err) => {
            console.log("error while fetching issued books");
        });
      }
    }
  });
