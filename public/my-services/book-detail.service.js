var libraryApp = angular.module('libraryManagement');

libraryApp.factory('BookInfo', function() {

  var book = {
                id: '',
                name: '',
                author: '',
                no_of_copy: 0,
                avavilable_copy: 0,
                category: '',
                comapny_id: '',
                isbn: ''
  };

  return {
    setBookId: function(id) {
      book.id = id;
    },
    getBookId: function() {
      return book.id;
    },
    setBookName: function(name) {
      book.name = name;
    },
    getBookName: function() {
      return book.name;
    },
    setAuthorName: function(author) {
      book.author = author;
    },
    getAuthorName: function() {
      return book.author;
    },
    setNoOfCopy: function(num) {
      book.no_of_copy = num;
    },
    getNoOfCopy: function() {
      return book.no_of_copy;
    },
    setNoOfAvailabeCopy: function(num) {
      book.no_of_available_copy = num;
    },
    getNoOfAvailableCopy: function() {
      return book.no_of_available_copy;
    },
    setCompanyId: function(id) {
      book.company_id = id;
    },
    getCompanyId: function() {
      return book.company_id;
    },
    setISBN: function(isbn) {
      book.isbn = isbn;
    },
    getISBN: function() {
      return book.isbn;
    }
  }
});
