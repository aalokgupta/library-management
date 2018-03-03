
var libraryApp = angular.module('libraryManagement');

libraryApp.factory('requestedBookService', function($sessionStorage, request) {
  var factory = {};
  // factory.getAllRequestedBook = function() {
  //   var req = {
  //     method: 'GET',
  //     url: '/requested-books',
  //     headers: {
  //       "access-x-auth": $sessionStorage.token,
  //       "admin": $sessionStorage.admin,
  //       "user_id": $sessionStorage.user_id
  //     }
  //   };
  // return request.getmethod(req);
  // }

  factory.getUserRequestedBook = function(user_id) {
    var req = {
    method: 'GET',
    url: `/get-requested-books/${user_id}`,
    headers: {
      "access-x-auth": $sessionStorage.token,
      "user_id": $sessionStorage.user_id
    }
  };
  return request.getmethod(req);
}
  return factory;
});
