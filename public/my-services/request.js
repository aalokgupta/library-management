
var libraryApp = angular.module('libraryManagement');

libraryApp.factory('request', ['$http', function(http){
  var request = {};

  request.getmethod = function(req) {
    // console.log(JSON.stringify(req, undefined, 2));
     return http(req).then((response) => {
      if(200 === response.status) {
        console.log(JSON.stringify(response.data, undefined, 2));
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
     return http(req).then((response, header) => {
      if(200 === response.status) {
            return response;
      }
      else {
        return response.status;
      }
    }, (error) => {
        return err;
    });
  }


  request.deletemethod =  function(req) {
    return http(req).then((response) => {
      if(200 === response.status) {
        console.log("books successfully deleted ");
        return response.data;
      }
      else {
        return response.status;
      }
    }, (err) => {
      return err;
    });
  }

  return request;
}]);
