  var issuedBookApp = angular.
                      module('issuedBooks').
                      component('issuedBooks', {
                        templateUrl: '/public/view-books/issued-books.html',
                        controller: 'issuedBooksController'
                      });

  var requestedBookApp = angular.
                      module('requestedBooks').
                      component('requestedBooks', {
                        templateUrl: '/public/view-books/requested-books.html',
                        controller: 'requestedBooksController'
                      });

   requestedBookApp.controller('requestedBooksController', function($scope){

   });

   issuedBookApp.controller('issuedBooksController', function($scope){

   });
