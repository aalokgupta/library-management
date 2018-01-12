var addBookApp = angular.
    module('addBook').
    component('addBook', {
    templateUrl: '/public/add-book/add-book.html',
    controller: 'addBookController'
  });

addBookApp.factory('AddBook', function($sessionStorage, request){

  var factory = {};

  factory.add = function(book){
    var req = {
                method: 'POST',
                url: '/add-book',
                headers: {
                  "access-x-auth": $sessionStorage.token,
                  "admin": $sessionStorage.admin
                }
              }
    return request.postmethod(req).then((response) => {
        if(200 === response.status) {
          return response.data;
        }
    }, (err) => {
      return err;
    });
  }

  return factory;
});

addBookApp.controller('addBookController', function($scope, $sessionStorage, AddBook) {
          // console.log($location.url());
  if($sessionStorage.token) {
    // if($sessionStorage.admin) {
    // }
    $scope.data = {
                  nav_admin_menu:  {name: "admin", url: "/public/add-book/admin-nav-menu.html"},
                  bookCategory: null,
                  categoryOptions: [
                                   {id: 1, name: '------------ Select Book Category--------------'},
                                   {id: 2, name: 'A'},
                                   {id: 3, name: 'B'},
                                   {id: 4, name: 'C'},
                                   {id: 5, name: 'D'},
                                   {id: 6, name: 'E'},
                                   {id: 7, name: 'F'},
                                   {id: 8, name: 'Other'}
                                 ]
              };

    $scope.addBook = function() {
      var book = {
                  name: $scope.bookName,
                  author: $scope.bookAuthor,
                  no_of_copy: $scope.bookNoOfCopy,
                  isbn: $scope.bookISBN,
                  company_id: $scope.bookCopmanyId,
                  category: $scope.bookCategory
      };

      AddBook.add(book).then((response) => {
          console.log("Book has been added successfully");
      }, (err) => {
        console.log("server not responsding while adding book");
      });
    }
  }
  else {
    $window.loation.href = "#!/login";
  }
});
