app.controller('MultipleChoiceCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
  $scope.multipleQuestionOptions = [];
  $scope.multipleChoice;
  $scope.moreChoices = function(value){
    $scope.multipleQuestionOptions.push(value);
    $scope.multipleChoice = "";
  }
  $scope.removeChoice = function(index){
    $scope.multipleQuestionOptions.splice($scope.multipleQuestionOptions.indexOf(index),1);
  }

}]);
