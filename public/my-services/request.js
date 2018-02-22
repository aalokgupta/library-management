
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
          return response.status;
       }
     }, (error) => {
         return error;
     });
  }

  request.postmethod = function(req) {
    return http(req).then((response, header) => {
      if(200 === response.status) {
          console.log(response.headers('token'));
          return response;
      }
      // else {
      //     return response.status;
      // }
    }, (error) => {
        console.log(error);
        return error;
    });
  }


  request.deletemethod =  function(req) {
    return new Promise(function(resolve, reject){
      http(req).then((response) => {
        if(200 === response.status) {
          console.log("books successfully deleted ");
          resolve(response.data);
        }
        else {
          reject(response.status);
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  return request;
}]);
