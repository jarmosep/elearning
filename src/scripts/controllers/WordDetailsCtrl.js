app.controller("WordDetailsCtrl", ["$scope", "$state", '$stateParams', function($scope, $state, $stateParams){
  $scope.word = $stateParams.obj;
}]);
