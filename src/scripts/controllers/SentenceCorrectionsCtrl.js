app.controller('SentenceCorrectionsCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
  $scope.sentenceFaults = [];
  $scope.sentenceFault;
  $scope.addFault = function(value){
    $scope.sentenceFaults.push(value);
    $scope.sentenceFault = "";
  }
  $scope.removeChoice = function(index){
    $scope.sentenceFaults.splice($scope.sentenceFaults.indexOf(index),1);
  }

}]);
