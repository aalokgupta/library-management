
var libraryApp = angular.module('libraryManagement');

libraryApp.factory('request', ['$http', function(http){
  var request = {};

  request.getmethod = function(req) {
    // console.log(JSON.stringify(req, undefined, 2));
     return http(req).then((response) => {
      if(200 === response.status) {
            return response.data;
      }
      else {
        console.log(" Details can be not fetched from server ");
      }
    }, (error) => {
        console.log("Details can be fetched from server "+error);
    });
  }

  request.postmethod = function(req) {
     return http(req).then((response) => {
      if(200 === response.status) {
            console.log("response = "+JSON.stringify(response, undefined, 2));
            return response.data;
      }
      else {
        return response.status;
      }
    }, (error) => {
        return err;
    });
  }
  return request;
}]);
