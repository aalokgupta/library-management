var loginApp = angular.module('logIn').
        component('logIn', {
          templateUrl: '/public/login-signup/login.html',
          controller: 'loginController'
      });

var allBookModule = angular.module('allBooks').
                      component('allBooks', {
                          templateUrl: '/public/login-signup/all-books.html',
                          controller: 'bookController'
            });

allBookModule.controller('bookController', function($scope, $http){

  $scope.data = {
    nav_template: {name: "signup", url: "/public/login-signup/nav-login-signup.html"},
    menus: [{url: '#!all-books', name: 'Books'},
                  {url: '#!login', name: 'Login'},
                  {url: '#!signup', name: 'Signup'}
                ],
    nav_active_color: ['#000', '', '']
  };

  // $scope.nav_template =  {name: "login", url: "/public/login-signup/nav-login-signup.html"};
  //
  // var menus = [ {url: '#!all-books', name: 'Books'},
  //               {url: '#!login', name: 'Login'},
  //               {url: '#!signup', name: 'Signup'}
  //             ];
  //
  // $scope.menus = menus;

  var req = { method: 'GET',
              url: '/get-all-books',
            };
  $http(req).then((response) => {
    if(200 === response.status) {
        $scope.books = response.data;
    }
    else {
      console.log("unable to fetch book details from server");
    }

  }, (err) => {
    console.log("Not able to connect to server "+err);
  });
});

loginApp.factory('login', function($sessionStorage, request){
  var factory = {};
  factory.login =  function(userInfo) {
    var req = {
      method: 'POST',
      url: '/login',
      data: userInfo
    };

    return request.postmethod(req).then((response) => {
      console.log("login response = "+response);
      return response;
    }, (err) => {
        return err;
    });
  }
  return factory;
});

loginApp.controller('loginController', function($scope, $sessionStorage, $window, login){
  // read username password admin/user and secret key
  $scope.data = {
    nav_template: {name: "signup", url: "/public/login-signup/nav-login-signup.html"},
    menus: [{url: '#!all-books', name: 'Books'},
                  {url: '#!login', name: 'Login'},
                  {url: '#!signup', name: 'Signup'}
                ],
    nav_active_color: ['', '#000', '']
  };

  if($sessionStorage.token) {
     if(true === $sessionStorage.admin) {
       $window.location.href = '#!/list-books';
    }
  }

  $scope.onClickLogin = function() {
    if(parseInt($scope.user_type.id) === 1 && $scope.logInForm.admin_secret_key.$valid === false) {
      console.log("secret key required for admin");
      return;
    }
    var admin = false || $scope.logInForm.admin_secret_key.$valid;
    if($scope.logInForm.email.$valid === true) {
      if($scope.logInForm.password.$valid === true) {
        var body = {email: $scope.email,
                    password: $scope.password,
                    admin: admin
                   };

        if(true === admin) {
           body["admin_secret_key"] = $scope.admin_secret_key;
         }
        login.login(body).then((response) => {
          $sessionStorage.token = response.headers("access-x-auth");
          $sessionStorage.admin = response.headers("admin");
          $sessionStorage.user_id = response.headers("user_id");

          if("false" === $sessionStorage.admin) {
            console.log("inside view book");
              $window.location.href =  '/#!/user-home';
          }
          else if("true" === $sessionStorage.admin) {
              // $window.location.href =  '/#!/list-books';
              $window.location.href =  '/#!/user-page';
          }

        }, (err) => {
            console.log("There are some problem in login, contact admin");
        });
      }
      else {
          console.log("password can not be set empty");
      }
    }
    else {
      console.log("Email id is not valid");
    }
  }
});

var signupApp = angular.module('signUp').
        component('signUp', {
          templateUrl: '/public/login-signup/signup.html',
          controller: 'signupController'
        });

signupApp.factory('signup', function($sessionStorage, request) {

  var factory = {};
  factory.signup = function(userInfo) {
    var req = {
      method: 'POST',
      url: '/signup',
      data: userInfo
    };
   return request.postmethod(req).then((response) => {
        $sessionStorgae.token = response.headers("token");
        $sessionStorgae.admin = response.headers("admin");
        $sessionStorage.user_id = response.headers("user_id");
    }, (err) => {
        return err;
    });
   }
  return factory;
});

signupApp.controller('signupController', function($scope, $sessionStorage, $window, signup) {

    $scope.data = {
      nav_template: {name: "signup", url: "/public/login-signup/nav-login-signup.html"},
      menus: [{url: '#!all-books', name: 'Books'},
                    {url: '#!login', name: 'Login'},
                    {url: '#!signup', name: 'Signup'}
                  ],
      nav_active_color: ['', '', '#000']
    };

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

                var userInfo = {
                         username: $scope.username,
                         email: $scope.email,
                         password: $scope.password,
                         admin: admin,
                         admin_secret_key: $scope.admin_secret_key
                };

                signup.signup(userInfo).then((response) => {
                    if($sessionStorage.token) {
                      if(true === $sessionStorgae.admin) {
                        $window.location.href =  '/#!/list-books'
                      }
                      else if(false === $sessionStorgae.admin) {
                        $window.location.href =  '/#!/view-books'
                      }
                      else {
                        // $window.location.href =  '/#!/view-books'
                      }
                    }
                }, (err) => {
                    console.log("not able to signup");
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




        // admin_secret_key:
        // var req = {
        //   method: 'POST',
        //   url: '/login',
        //   data: body
        // };

        // $http(req).then(function onSuccess(response){
        //   if(response.status === 200){
        //     $sessionStorage.token = response.headers("access-x-auth");
        //     $sessionStorage.admin = response.headers("admin");
        //     $sessionStorage.isUserLoggedIn = true;
        //     console.log("token = "+$sessionStorage.token+"  "+$sessionStorage.admin);
        //     $window.location.href =  '/#!/list-books';
        //     // change the url to home after providing message
        //   }
        //   else if(response.status === 400) {
        //     console.log("There are some problem in login, contact admin");
        //   }
        // }, function onError(response) {
        //     console.log("some error occured "+JSON.stringify(response.data));
        //     // display msg on failure below the signup-form
        // });
