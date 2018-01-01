angular.
      module('listBooks').
      component('listBooks', {
        templateUrl: '/public/list-books/list-book.html',
        controller: function listBookController($scope, $location) {

            console.log("inside listBooks console"+$location.url());
        }
      });
