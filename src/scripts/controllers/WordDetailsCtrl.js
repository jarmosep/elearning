app.controller("WordDetailsCtrl", ["$scope", "$state", '$stateParams', function($scope, $state, $stateParams){
  $scope.word = $stateParams.obj;
  var letters = $scope.word.japanese.split("");
  $scope.kanjis = [];
  for(var i=0; i < letters.length; i++){
    if(letters[i].match(/^[\u4e00-\u9faf]+$/)){
      $scope.kanjis.push(letters[i]);
    }
  }
}]);
