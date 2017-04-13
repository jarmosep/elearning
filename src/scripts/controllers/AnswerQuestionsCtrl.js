app.controller('AnswerQuestionsCtrl', ['authFactory', '$scope', function(authFactory, $scope){

  $scope.tab = 1;
  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  }
  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  }
}]);
