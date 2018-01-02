var loginApp = angular.module('logIn').
        component('logIn', {
          templateUrl: '/public/login-signup/login.html',
          controller: 'loginController'
        });

loginApp.controller('loginController', function($scope, $http){
  // read username password admin/user and secret key

});


var signupApp = angular.module('signUp').
        component('signUp', {
          templateUrl: '/public/login-signup/signup.html',
          controller: 'signupController'
        });

signupApp.controller('signupController', function($scope, $http, $location){
    // check if user already present
    // //make signup text as string and number only
    // if($scope.user_type.id === 1){
    //   $scope.signupForm.admin_secret_key.visible
    // }
    $scope.onClickSignup = function() {

      if(parseInt($scope.user_type.id) === 1 && $scope.signupForm.admin_secret_key.$valid === false) {
        console.log("secret key required for admin");
        return;
      }
      else {
        var admin = false || $scope.signupForm.admin_secret_key.$valid;
        if($scope.signupForm.username.$valid === true &&  $scope.username.length > 4){
          if($scope.signupForm.email.$valid === true) {
            if($scope.signupForm.password.$valid  === true && $scope.password.length >= 5) {
              if($scope.repassword === $scope.password) {
                console.log("valid form data");

                var req = {
                  method: 'POST',
                  url: '/signup',
                  data: {username: $scope.username,
                         email: $scope.email,
                         password: $scope.password,
                         admin: admin,
                         admin_secret_key: $scope.admin_secret_key
                        }
                };
                $http(req).then(function onSuccess(response){
                  if(response.status === 200){
                    console.log("after signup string return from server is "+response.headers("x-auth"));
                    $location.path('https://127.0.0.1:8080');
                    // change the url to home after providing message
                  }
                  else if(response.status === 400) {
                    console.log("There are some problem in sing-up contact admin");
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
          console.log("username having some issue");
        }

      }


    }
});
