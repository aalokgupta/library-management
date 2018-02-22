var updateBookApp = angular.
                            module('updateBook').
                            component('updateBook', {
                            templateUrl: '/public/add-book/update-book.html',
                            controller: 'updateBookController'
                          });


 updateBookApp.factory('updateBook', function($sessionStorage, request){
   var factory = {};

   factory.update = function(book) {
     console.log("user id = "+$sessionStorage.user_id);
     var req = {
                method: 'post',
                url: '/update-book',
                headers: {
                  "access-x-auth": $sessionStorage.token,
                  "admin": $sessionStorage.admin,
                  "user_id": $sessionStorage.user_id
                },
                data: {
                  book: book
                }
              }

    return request.postmethod(req).then((book) => {
          return book;
     }, (err) => {
       return err;
     });
   }
   return factory;
 });


updateBookApp.controller('updateBookController', function($scope, $sessionStorage, $window,
                                                          BookInfo, updateBook) {

  console.log("inside updateBookController");
  // console.log($sessionStorage.token);
  $scope.initData = {
                      navItem:
                                 [{name: 'Home', url: '', count: 0},
                                  {name: 'AddBook', url: '', count: 1},
                                  {name: 'Pending', url: '', count: 2},
                                  {name: 'Issued', url: '', count: 3},
                                  {url: ''},
                                  {name: 'Profile', url:  '', count: 5},
                                  {name: 'Logout', url: '', count: 6}]
                    };

  if($sessionStorage.token) {
  // if($sessionStorage.admin) {
    // }
    $scope.nav_admin_menu =  {name: "admin", url: "/public/add-book/admin-nav-menu.html"};
    // console.log("book-name "+BookInfo.getAuthorName());

    var book = {};

    $scope.searchBook = BookInfo.getBookName();
    $scope.bookName = BookInfo.getBookName();
    $scope.bookAuthor = BookInfo.getAuthorName();
    $scope.bookISBN = BookInfo.getISBN();
    $scope.bookNoOfCopy = BookInfo.getNoOfCopy();
    $scope.bookCopmanyId = BookInfo.getCompanyId();

    $scope.onClickNavMenu = function(item) {
      $window.location.href = '#!/admin-landing';
      $sessionStorage.nav_menu = item.count;
    }
    $scope.onClickUpdateBook = function() {
        var book = {
                    book_id: BookInfo.getBookId(),
                    name: $scope.bookName,
                    author: $scope.bookAuthor,
                    isbn: $scope.bookISBN,
                    no_of_copy: $scope.bookNoOfCopy,
                    companyid: $scope.bookCopmanyId
                    };

         updateBook.update(book).then((updatedBook) => {
            console.log("book detail has been updated = "+updatedBook);
            $window.location.href = "#!/admin-landing";
        }, (err) => {
            return new Error("book detail can not be updated");
        });
    }
  }
  else {
    $window.location.href = "#!/login";
  }
});
