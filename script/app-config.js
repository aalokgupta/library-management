angular.
        module('libraryManagement').
        config(['$locationProvider', '$routeProvider' ,
        function config($locationProvider, $routeProvider) {
          console.log("inside config");
          $locationProvider.hashPrefix('!');

          $routeProvider.
          when('/add-book', {
            template: '<add-book></add-book>'
          }).
          when('/list-books', {
            template: '<list-books></list-books>'
          }).
          when('/update-book', {
            template : '<update-book></update-book>'
          }).
          when('/delete-book', {
          }).
          otherwise('/list-books');
        }
  ]);
