var listBookApp = angular.
                  module('userPage').
                  component('userPage', {
                    templateUrl: '/public/list-books/user-page.html',
                    controller: 'userController'
                  });

  listBookApp.factory('performLogout', function($sessionStorage, request){
    var factory = {};

    factory.logout = function() {
     console.log("logout clicked");
     var req = {
       method: 'DELETE',
       url: `/logout`,

       headers: {
         "access-x-auth": $sessionStorage.token,
         "admin": $sessionStorage.admin
         }
     };

     request.getmethod(req).then((success) => {
       $sessionStorage.token = "";
       $sessionStorage.admin = "";
       console.log("token deleted");
       window.location.href = "/#!/login";
       console.log("user logout successfully");
     }, (err) => {
       console.log("err occured while performing logout");
     });
   }
    return factory;
  });

 listBookApp.controller('userController', function($scope, $sessionStorage,
                                                   performLogout) {

  var body_url =   [  {url: '/public/list-books/list-book.html'},
                      {url: '/public/add-book/add-book.html'},
                      {url: '/public/list-books/admin-pending-request.html'},
                      {url: '/public/list-books/admin-issued-book.html'},
                      {url: ''},
                      {url: '/public/list-books/admin-profile.html'},
                      {url: ''}
                    ];

  $scope.initData = {
                      navItem:
                                 [{name: 'Home', url: '', count: 0},
                                  {name: 'AddBook', url: '', count: 1},
                                  {name: 'Pending', url: '', count: 2},
                                  {name: 'Issued', url: '', count: 3},
                                  {url: ''},
                                  {name: 'Profile', url:  '', count: 5},
                                  {name: 'Logout', url: '', count: 6}]
                    };

  /* nav_menu is used for the purpose when nav menu is clicked by user while updating the book detail
     updating book detail containing same nav_menu copy. When menu clicked the menu count is set to sessionStorage
     for reference
  */

  if($sessionStorage.nav_menu) {
      var index = parseInt($sessionStorage.nav_menu);
      $scope.body = body_url[index].url;
      $sessionStorage.nav_menu = "";
  }
  else {
      $scope.body = body_url[0].url;
  }

  $scope.onClickNavMenu = function(item) {
  switch (item.count) {
    case 0:
      $scope.body = body_url[0].url;
      break;
    case 1:
      $scope.body = body_url[1].url;
      break;
    case 2:
      $scope.body = body_url[2].url;
      break;
    case 3:
      $scope.body = body_url[3].url;
      break;
    case 4:
      $scope.body = body_url[4].url;
      break;
    case 5:
      break;
    case 6:
       performLogout.logout();
      break;
      }
    }
  });
