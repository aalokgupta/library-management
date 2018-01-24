  var issuedBookApp = angular.
                      module('issuedBooks').
                      component('issuedBooks', {
                        templateUrl: '/public/view-books/issued-books.html',
                        controller: 'issuedBooksController'
                      });

   issuedBookApp.controller('issuedBooksController', function($scope, $sessionStorage,
                                                              issuedBookService){
     if($sessionStorage.token) {
       if("false" === $sessionStorage.admin && $sessionStorage.user_id) {
         issuedBookService.getUserIssuedBook($sessionStorage.user_id).then((issuedBooks) => {
           $scope.issued_books = issuedBooks;
         }, (err) => {
           console.log(err);
         });
       }
     }
   });




   //
   // var requestedBookApp = angular.
   //                     module('requestedBooks').
   //                     component('requestedBooks', {
   //                       templateUrl: '/public/view-books/requested-books.html',
   //                       controller: 'requestedBooksController'
   //                     });
   //
   //  requestedBookApp.controller('requestedBooksController', function($scope){
   //
   //  });
