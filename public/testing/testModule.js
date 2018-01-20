var app = angular.module('testApp', []).
                  controller('testController', function($scope)  {

                    $scope.body = './home.html';

                    $scope.onClickBtn1 = function() {
                      $scope.body = "./home.html";
                    }

                    $scope.onClickBtn2 = function() {
                      $scope.body = './books.html';
                    }
                  });
