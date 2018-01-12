var updateBookApp = angular.
                            module('updateBook').
                            component('updateBook', {
                            templateUrl: '/public/add-book/update-book.html',
                            controller: 'updateBookController'
                          });


 updateBookApp.factory('updateBook', function($sessionStorage, request){
   var factory = {};

   factory.update = function(book, id) {
     var req = {
                method: 'post',
                url: `/update-book/${id}`,
                headers: {
                  "access-x-auth": $sessionStorage.token,
                  "admin": $sessionStorage.admin
                }
     }

    return request.getmethod(req).then((book) => {
          return book;
     }, (err) => {
       return err;
     });
   }
   return factory;
 });


updateBookApp.controller('updateBookController', function($scope, $sessionStorage,
                                                          BookInfo, updateBook) {
  console.log("inside updateBookController");
  if($sessionStorage.token) {
  // if($sessionStorage.admin) {
    // }
    $scope.nav_admin_menu =  {name: "admin", url: "/public/add-book/admin-nav-menu.html"};
    console.log("book-name "+BookInfo.getAuthorName());
    $scope.searchBook = BookInfo.getBookName();
    $scope.bookName = BookInfo.getBookName();
    $scope.bookAuthor = BookInfo.getAuthorName();
    $scope.bookISBN = BookInfo.getISBN();
    $scope.bookNoOfCopy = BookInfo.getNoOfCopy();
    $scope.bookCopmanyId = BookInfo.getCompanyId();

    $scope.onClickUpdateBook = function() {
      console.log("on-click updateBook");
        var id = 1; //BookInfo.getBookId();
        var book = {name: "abcd"};
        updateBook.update(book, id).then((success) => {
            console.log("book detail has been updaed");
        }, (err) => {
            console.log("book detail can not be updtaed");
        });
    }
  }
  else {
    $window.location.href = "#!/login";
  }

});
