app.controller("QuizCtrl", ["$scope", "$state", '$stateParams', '$timeout', function($scope, $state, $stateParams, $timeout){
  var urlParam = $stateParams.assignment;
  if(!urlParam){
    $state.go('dashboard.assignment');
  }
  var user = firebase.auth().currentUser;
  $scope.hide = false;
  var decoded = decodeURIComponent(urlParam);
  var deck = firebase.database().ref('assignmentsStudent')

  var assignment = deck.orderByChild("deckName").equalTo(decoded).once("value", function(dataSnapshot) {
    var assignmentData = dataSnapshot.val();
    $scope.assignment = assignmentData[Object.keys(assignmentData)];
    console.log($scope.assignment);

    /*
    $timeout(function(){
      $scope.loading = false;
    }, 0);
    */
  });
  $scope.answerChoices = false;
  $scope.answer = {'opacity': 0};
  $scope.showText = "Show answer";
  $scope.showAnswer = function(){
    $scope.answer = {'opacity': 1};
    $scope.showText = "Do you remember this word?";
    $scope.answerChoices = true;
  };

}]);
