app.controller('WordSubmitCtrl', ['$scope', 'addWord', function($scope, addWord){
  $scope.form = {};

  $scope.onSubmit = function(expression, reading, meaning, tags, sentences){
    addWord.submitWord(expression, reading, meaning, tags, sentences);
    $scope.form = null;
  }
  $scope.clearFields = function(){
    $scope.form = null;
  }
}]);
