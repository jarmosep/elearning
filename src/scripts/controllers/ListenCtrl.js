app.controller("ListenCtrl", ["$scope", "$state", '$stateParams', '$timeout', 'ForvoPronunciation', function($scope, $state, $stateParams, $timeout, ForvoPronunciation){
  var urlParam = $stateParams.assignment;
  $scope.apikey = '41e06f6960485179ce1492360c818962';
  if(!urlParam){
    $state.go('dashboard.assignment');
  }
  var cardsLength, card, url, audiofile, audio, percentage, words, getAudio;
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

  });
  $scope.hideInitial = { 'opacity': 1 };
  $scope.showVoice = { 'opacity': 0 };
  $scope.getWord = function(word){
     $scope.hideInitial = { 'opacity': 0 };
     $scope.showVoice = { 'opacity': 1 };
     getAudio = ForvoPronunciation.getSoundfile($scope.apikey, word);
     getAudio.then(function(response){
       audio = new Audio(response.data.items[0].pathmp3);
     });
  };


  $scope.playAudio = function(){
      audio.play();
  };


  $scope.index = 0;
  $scope.answer = {'opacity': 0};
  $scope.quizOver = false;
  $scope.counter = 0;
  $scope.hide = false;
  $scope.progressPercentage = 0;
  $scope.listeningWrong = false;
  $scope.listeningRight = false;
  $scope.listening = false;

  $scope.showCorrectExpression = function(userAnswer, currentWord){
    if(userAnswer == currentWord){
      $scope.showUserAnswer = userAnswer;
      $scope.listeningRight = true;
      $scope.listening = true;
      $scope.answer = {'opacity': 1};
    }else{
      $scope.showUserAnswer = userAnswer;
      $scope.listeningWrong = true;
      $scope.listening = true;
      $scope.answer = {'opacity': 1};
    }
  }

  $scope.nextWord = function(count, nextSound){
    if(count === 0){ $scope.counter += 0; }
    if(count === 1){ $scope.counter += 1; }
    $scope.listeningRight = false;
    $scope.listeningWrong = false;
    $scope.listening = false;
    $scope.progressPercentage += card;
    $scope.index = $scope.index + 1;
    $scope.answer = {'opacity': 0};
    if($scope.index >= cardsLength){
      $scope.quizOver = true;
      $scope.hide = true;
      console.log("You got " + $scope.counter + " out of " + cardsLength + " right!");
    }
  }

}]);
