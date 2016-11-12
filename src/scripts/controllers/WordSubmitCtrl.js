app.controller("WordSubmitCtrl", ["$scope", function($scope){
  $scope.form = {};
  $scope.onSubmit = function(){
    console.log($scope.form);
    $scope.form = null;
  }
  $scope.clearFields = function(){
    $scope.form = null;
  }
}]);
