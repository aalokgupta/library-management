var listBookApp = angular.
                  module('listBooks').
                  component('listBooks', {
                    templateUrl: '/public/list-books/list-book.html',
                    controller: 'listBookController'
                  });

listBookApp.controller('listBookController', function($scope, $location, $sessionStorage, $http) {
    $scope.books = [{name: "Pratical unix & Internet Security",
                     author: "Simon Garfinkel and gene Spafford",
                    no_of_copy: "10",
                    no_of_available_copy: 8},

                    {name: "Effective STL",
                    author: "scott mayers",
                    no_of_copy: "20",
                    no_of_available_copy: 20},

                    {name: "Data structure in C",
                     author: "Narsimha karanuchi",
                     no_of_copy: "5",
                     no_of_available_copy: 2}
                  ];

    $scope.onClickUpdate = function() {
      if($sessionStorage.token) {
        console.log($sessionStorage.token);
        if($sessionStorage.admin)
          console.log($sessionStorage.admin);
          var req = {
            method: 'POST',
            url: `/update/book/1`,
            data: {
                    name: 'Data structure in c'
                  },
            headers: {
              "access-x-auth": $sessionStorage.token,
              "admin": $sessionStorage.admin
            }
          }

          $http(req).then((response) => {
            if(response.status === 200) {
              console.log("user authenticated");
            }
          }, (error) => {
            console.log("user not authenticated");
          });
      }
    }
    $scope.onClickDelete = function() {
      if($sessionStorage.token) {
        console.log($sessionStorage.token);
        if($sessionStorage.admin)
          console.log($sessionStorage.admin);
      }
    }

    $scope.onClickLogout = function() {
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
          console.log("token deleted");
          $location.path("https://127.0.0.1:8080/#!/login");
        }
      }, (response) => {
          console.log("not able to delete token ");
      });
    }
    });
