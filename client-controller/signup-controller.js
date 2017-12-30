// validate username
//validate emial
//match password

var signUpApp = angular.module('signUpModule', []);
var loginApp  = angular.module('loginModule', []);

signUpApp.controller('signUpController', function($scope, $http){
  $scope.onClickSignup = function(){
    var user = {'username': $scope.username,
                'email': $scope.email,
                'password': $scope.password
               };
               $scope.user = user;
               console.log("userDetail = "+JSON.stringify(user, undefined, 2));
               $http({
                      method: 'POST',
                      url: '/admin/signup',
                      data: user,
                      headers: {
                      'Content-Type': 'application/json'
                      }
                      }).then((response) => {
                          console.log(`response from server = ${response.headers('x-auth')} and response status is ${response.status}`);
                          window.location.href = "/admin/login";
                      }, (err) => {
                          console.log("error "+JSON.stringify(err, undefined, 2));
                      });
                    }
                  });


loginApp.controller('loginController', function($scope, $http){
  $scope.onClickLogin = function(){
    var userCredential = {'email': $scope.email,
                          'password': $scope.password};
    $http({
        method: 'POST',
        url: '/admin/login',
        data: userCredential,
        headers: {
          'Content-Type': 'application/json'
        }
    }).then((response) => {
      console.log("Successfull login "+response.headers('x-auth'));
      window.location.href = "/";
    }, (err) => {
      console.log("Error while login "+JSON.stringify(err, undefined, 2));
    });
  }
});



                      // on click send request to server for signup
