var libraryApp = angular.module('libraryManagement');

  libraryApp.factory('performLogout', function($sessionStorage, request){
    var factory = {};
    factory.logout = function() {
     console.log("#########logout clicked");
     console.log("user_id = "+$sessionStorage.user_id);
     var req = {
       method: 'DELETE',
       url: '/logout',
       headers: {
         "access-x-auth": $sessionStorage.token,
         "admin": $sessionStorage.admin,
         "user_id": $sessionStorage.user_id
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
