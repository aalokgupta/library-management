var requestedBookApp = angular.
                    module('requestedBooks').
                    component('requestedBooks', {
                      templateUrl: '/public/view-books/requested-books.html',
                      controller: 'requestedBooksController'
                    });

 requestedBookApp.controller('requestedBooksController', function($scope, $sessionStorage,
                                                            requestedBookService) {
   if($sessionStorage.token) {
     if("false" === $sessionStorage.admin && $sessionStorage.user_id) {
         requestedBookService.getUserRequestedBook($sessionStorage.user_id).then((requestedBooks) => {
         $scope.requested_books = requestedBooks;
       }, (err) => {
         console.log(err);
       });
     }
   }
 });
