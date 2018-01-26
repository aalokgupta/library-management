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
          when('/all-books', {
            // user has to be deleted from sessionStorage
            template: '<all-Books></all-Books>'
          }).
          when('/user-home', {
            template: '<user-home></user-home>'
          }).
          when('/issued-books', {
            template: '<issued-Books></issued-Books>'
          }).
          when('/requested-books', {
            template: '<requested-Books></requested-Books>'
          }).
          when('/user-page', {
            template: '<user-Page></user-Page>'
          }).
          when('/', {
            template: '<log-In></log-In>'
          });
          // .
          // otherwise('/login');
        }
  ]);


var libraryApp = angular.module('libraryManagement');

libraryApp.factory('NavBarService', ['$sessionStorage',function($sessionStorage) {

  if($sessionStorage.token){
      var nav = {name: "admin-nav", url: "/public/list-books/admin-list-book-nav.html"};
      return nav;
  }
  return {name: "list-books", url: "/public/list-book-nav.html"};;
}]);


libraryApp.controller('libraryManagementController', ['NavBarService', '$scope', '$sessionStorage', function(NavBarService, $scope, $sessionStorage){
          console.log("inside library controller");
          console.log($sessionStorage.token);
          if($sessionStorage.token){
                var nav = {name: "admin-nav", url: "/public/list-books/admin-list-book-nav.html"};
                  // $scope.nav_template =  nav;
                  $scope.isUserLoggedIn = $sessionStorage.isUserLoggedIn || true;
            }
            else{
              $scope.isUserLoggedIn = $sessionStorage.isUserLoggedIn  || false;
              // $scope.nav_template =  {name: "list-books", url: "/public/list-book-nav.html"};
            }
            $scope.nav_template =  {name: "list-books", url: "/public/list-book-nav.html"};


            $scope.onClickLogOut = function () {
              console.log("logout clicked");
              var req = {
                method: 'DELETE',
                url: `/logout`,
                headers: {
                  "access-x-auth": $sessionStorage.token
                  // "admin": $sessionStorage.admin
                  }
              }
              $http(req).then((response) => {
                if(response.status === 200) {
                  $sessionStorage.token = "";
                  $sessionStorage.admin = "";
                  $sessionStorage.isUserLoggedIn = "";
                  console.log("token deleted");
                  // $route.reload();
                  $window.location.href = "https://127.0.0.1:8080/#!/login";
                  // $location.path("https://127.0.0.1:8080");
                }
              }, (response) => {
                  console.log("not able to delete token ");
              });
            }
      }]);
