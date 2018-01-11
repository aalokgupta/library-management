var app = angular.
    module('addBook').
    component('addBook', {
    templateUrl: '/public/add-book/add-book.html',
    controller: 'addBookController'
  });

app.controller('addBookController', function($scope) {
          // console.log($location.url());
  $scope.nav_admin_menu =  {name: "admin", url: "/public/add-book/admin-nav-menu.html"};

});
