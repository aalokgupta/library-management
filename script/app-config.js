angular.
        module('libraryManagement').
        config(['$locationProvider', '$routeProvider' ,
        function config($locationProvider, $routeProvider) {
          console.log("inside config");
          $locationProvider.hashPrefix('!');

          $routeProvider.
          when('/add-book', {
            template: '<add-book></add-book>'
          }).
          when('/list-books', {
            template: '<list-books></list-books>'
          }).
          when('/update-book', {
            template : '<update-book></update-book>'
          }).
          when('/delete-book', {
          }).
          when('/login', {
            template: '<log-In></log-In>'
          }).
          when('/signup', {
            template: '<sign-Up></sign-Up>'
          }).
          when('/logout', {
            // user has to be deleted from sessionStorage
            template: '<log-In></log-In>'
          }).
          otherwise('/list-books');
        }
  ]);


var libraryApp = angular.module('libraryManagement');

libraryApp.controller('libraryManagementController', function($scope, $sessionStorage){
          console.log("inside library controller");
          if($sessionStorage.token){
            console.log("token available"+$sessionStorage.token);
              // if($sessionStorage.admin) {
                var nav = {name: "admin-nav", url: "/public/list-books/admin-list-book-nav.html"};
                $scope.nav_template = nav;
              // }
              // else {
              //   console.log("admin available"+$sessionStorage.admin);
              //
              //   var nav = {name: "user-nav", url: "/public/list-book-nav.html"};
              //   $scope.nav_template = nav;
              // }
          }
          else {
                console.log("token not available");
                 var nav = {name: "list-books", url: "/public/list-book-nav.html"};
                 $scope.nav_template = nav;

           }
      });
