

var pending_request_app = angular.module('pendingRequest', []).
                          component('pendingRequest', {
                           templateUrl: '/public/list-books/admin-pending-request.html',
                           controller:  'AdminPendingRequestController'
                        });
 pending_request_app.factory('pendingReqService', function(request, $sessionStorage){
   var factory = {};
   factory.getPendingRequest = function() {
     var req = {
                method: 'GET',
                url:   '/pending-book-request',
                headers: {
                  "access-a-auth": $sessionStorage.token,
                  "admin": $sessionStorage.admin
                }
              };

     return request.getmethod(req).then((response) => {
       console.log("response for pending req"+response);
        return response;
     }, (err) => {
       return err;
     });
   }
   return factory;
 });

pending_request_app.controller('AdminPendingRequestController', function($scope, $sessionStorage,
                                                                         pendingReqService) {

  if($sessionStorage.token) {
    if("true" === $sessionStorage.admin) {
      console.log("inside pending request controller");
      pendingReqService.getPendingRequest().then((response) => {
        console.log(JSON.stringify(response));
          $scope.pending_requests = response;
      }, (err) => {

      });
    }
  }
  // $scope.pending_requests = [{user_name: 'Aalok',
  //                             book_name: 'Data Structure in CPP',
  //                             time: '2 days ago'}];
});
