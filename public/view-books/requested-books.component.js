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

   $scope.onClickCancelRequest = function(requestedBook) {

     if($sessionStorage.token) {
       console.log("user-id = "+$sessionStorage.user_id);
       if("false" === $sessionStorage.admin && $sessionStorage.user_id) {
         console.log("onCLickRequestBook  "+$sessionStorage.admin);

         requestedBookService.cancelBookRequest($sessionStorage.user_id,
           requestedBook.book_id).then((response) => {
            var indexOfCancelRequest = $scope.requested_books.indexOf(requestedBook);
             $scope.requested_books.splice(indexOfCancelRequest, 1);
             console.log("requested book has been deleted");
           }, (err) => {
             console.log(err);
           });
       }
     }
   }
 });
