var libraryApp = angular.module('libraryManagement');

libraryApp.factory('issuedBookService', function($sessionStorage, request) {
  var factory = {};
  factory.getAllIssuedBook = function() {
    var req = {
      method: 'GET',
      url: '/issued-books',
      headers: {
        "access-x-auth": $sessionStorage.token,
        "admin": $sessionStorage.admin,
        "user_id": $sessionStorage.user_id
      }
    };
  return request.getmethod(req);
  }

  factory.getUserIssuedBook = function(user_id) {
    var req = {
    method: 'GET',
    url: `/get-issued-books/${user_id}`,
    headers: {
      "access-x-auth": $sessionStorage.token,
      "user_id": $sessionStorage.user_id
    }
  };
  return request.getmethod(req);
}
  return factory;
});
