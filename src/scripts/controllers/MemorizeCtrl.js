app.controller("MemorizeCtrl", ["$scope", "$state", '$stateParams', '$timeout', function($scope, $state, $stateParams, $timeout){
  var urlParam = $stateParams.assignment;
  if(!urlParam){
    $state.go('dashboard.assignment');
  }
  var cardsLength, card, percentage;
  var user = firebase.auth().currentUser;
  var decoded = decodeURIComponent(urlParam);
  var deck = firebase.database().ref('assignmentsStudent');
  var assignment = deck.orderByChild("deckName").equalTo(decoded).once("value", function(dataSnapshot) {
    var assignmentData = dataSnapshot.val();
    $scope.assignment = assignmentData[Object.keys(assignmentData)];
    cardsLength = $scope.assignment.words.length;
    card = (1 / cardsLength) * 100;
    var currentIndex = $scope.assignment.words.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = $scope.assignment.words[currentIndex];
      $scope.assignment.words[currentIndex] = $scope.assignment.words[randomIndex];
      $scope.assignment.words[randomIndex] = temporaryValue;
    }
    console.log($scope.assignment);
  });

  $scope.index = 0;
  $scope.answerChoices = false;
  $scope.answer = {'opacity': 0};
  $scope.showText = "Show answer";
  $scope.quizOver = false;
  $scope.counter = 0;
  $scope.hide = false;
  $scope.progressPercentage = 0;

  $scope.showAnswer = function(){
    $scope.answer = {'opacity': 1};
    $scope.showText = "Do you remember this word?";
    $scope.answerChoices = true;
  };

  $scope.nextWord = function(count){
    if(count === 0){ $scope.counter += 0; }
    if(count === 1){ $scope.counter += 1; }
    $scope.progressPercentage += card;
    $scope.index = $scope.index + 1;
    $scope.showText = "Show answer";
    $scope.answerChoices = false;
    $scope.answer = {'opacity': 0};
    if($scope.index >= cardsLength){
      $scope.quizOver = true;
      $scope.hide = true;
      console.log("You got " + $scope.counter + " out of " + cardsLength + " right!");
    }
  }

}]);
