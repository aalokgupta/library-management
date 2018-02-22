

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
                  "access-x-auth": $sessionStorage.token,
                  "admin": $sessionStorage.admin,
                  "user_id": $sessionStorage.user_id
                }
              };

     return request.getmethod(req).then((response) => {
       console.log("response for pending req"+response);
        return response;
     }, (err) => {
       return err;
     });
   }

   factory.acceptRequest = function(accepted_book_info) {
     var req = {
       method: 'POST',
       url: '/accept-book-request',
       headers: {
         "access-x-auth": $sessionStorage.token,
         "admin": $sessionStorage.admin,
         "user_id": $sessionStorage.user_id
       },
       data: {
         user_id: accepted_book_info.user_id,
         book_id: accepted_book_info.book_id,
         request_id: accepted_book_info.request_id
       }
     };
     return request.postmethod(req).then((response) => {
       return response;
     }, (err) => {
       return err;
     })
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
          console.log("unable to fetch ");
      });

    }
  }

  $scope.onClickAcceptBookRequest = function(request) {
    if($sessionStorage.token) {
      if("true" === $sessionStorage.admin) {
        console.log("request "+JSON.stringify(request));
        pendingReqService.acceptRequest(request).then((res) => {
          var index = $scope.pending_requests.indexOf(request);
          console.log("book has been issued for the user");
          $scope.pending_requests.splice(index, 1);
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }
});
