

var pending_request_app = angular.module('pendingRequest', []).
                          component('pendingRequest', {
                           templateUrl: '/public/list-books/admin-pending-request.html',
                           controller:  'AdminPendingRequestController'
                        });
 pending_request_app.factory('pendingReqService', function(request, $sessionStorage){
   var factory = {};
   var req = {
              method: 'GET',
              url:   '/pending-book-request',
              headers: {
                "access-a-auth": $sessionStorage.token
                "admin": $sessionStorage.admin
              }
            };

   return request.getmethod(req).then((response) => {
     console.log("response for pending req"+response);
   }, (err) => {
   });
 });

pending_request_app.controller('AdminPendingRequestController', function($scope, $sessionStorage,
                                                                         pendingReqService) {

  if($sessionStorage.token) {
    if(true === $sessionStorage.admin) {
      pendingReqService.getPendingRequest().then((response) {

      }, (err) => {

      });
    }
  }
  $scope.pending_requests = [{user_name: 'Aalok',
                              book_name: 'Data Structure in CPP',
                              time: '2 days ago'}];
});
