var loginApp = angular.module('logIn').
        component('logIn', {
          templateUrl: '/public/login-signup/login.html',
          controller: 'loginController'
        });

loginApp.controller('loginController', function($scope, $http){

});


var signupApp = angular.module('signUp').
        component('signUp', {
          templateUrl: '/public/login-signup/signup.html',
          controller: 'signupController'
        });

signupApp.controller('signupController', function($scope, $http){
    // check if user already present
    //make signup text as string and number only
    $scope.onClickSignup = function() {
      if($scope.username !== "" && $scope.username.length > 4){
        if($scope.signupForm.email.$valid === true) {
          if($scope.password.length >= 5) {
            if($scope.repassword === $scope.password) {
              console.log("valid form data");

              var req = {
                method: 'POST',
                url: '/signup',
                data: {username: $scope.username,
                       email: $scope.email,
                       password: $scope.password
                      }
              };
              $http(req).then(function onSuccess(response){
                if(response.status === 200){
                  console.log("after signup string return from server is "+response.headers("x-auth"));
                  // change the url to home after providing message
                }
              }, function onError(response) {
                  console.log("some error occured "+response.data)
                  // display msg on failure below the signup-form
              });

            }
            else {
              console.log("repassword having some issue");
            }
          } else {
            console.log("password having some issue");
          }
        } else {
            console.log("email having some issue ");
        }
      } else {
        console.log("username having some issue"+$scope.username.length);
      }

    }
});
