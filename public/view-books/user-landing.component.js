var homeApp = angular.
                  module('userLanding').
                  component('userLanding', {
                    templateUrl: '/public/view-books/user-landing-page.html',
                    controller: 'homeController'
                  });

 homeApp.controller('homeController', function($scope, $sessionStorage,
                                                   performLogout) {
  console.log("user landing page");
  var body_url =   [  {url: '/public/view-books/view-books.html'},
                      {url: '/public/view-books/issued-books.html'},
                      {url: '/public/view-books/requested-books.html'},
                      {url: ''},
                      {url: ''},
                      {url: '/public/list-books/user-profile.html'},
                      {url: ''}
                    ];

  $scope.initData = {
                      navItem:
                                 [{name: 'Home', url: '', count: 0},
                                  {name: 'Issued', url: '', count: 1},
                                  {name: 'Requested', url: '', count: 2},
                                  {name: '', url: '', count: 3},
                                  {name: '', url: '', count: 4},
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
      $scope.colors = ['#000', '', '', '', '', '', ''];
  }

  $scope.onClickNavMenu = function(item) {
  switch (item.count) {
    case 0:
      $scope.body = body_url[0].url;
      $scope.colors = ['#000', '', '', '', '', '', ''];
      break;
    case 1:
      $scope.body = body_url[1].url;
      $scope.colors = ['', '#000', '', '', '', '', ''];
      break;
    case 2:
      $scope.body = body_url[2].url;
      $scope.colors = ['', '', '#000', '', '', '', ''];
      break;
    case 3:
      $scope.body = body_url[3].url;
      $scope.colors = ['', '', '', '#000', '', '', ''];
      break;
    case 4:
      $scope.body = body_url[4].url;
      $scope.colors = ['', '', '', '', '#000', '', ''];
      break;
    case 5:
      break;
    case 6:
       performLogout.logout();
      $scope.colors = ['', '', '', '', '', '', '#000'];
      break;
      }
    }
  });
