app.controller("ListenCtrl", ["$scope", "$state", '$stateParams', '$timeout', 'ForvoPronunciation', function($scope, $state, $stateParams, $timeout, ForvoPronunciation){
  var urlParam = $stateParams.assignment;
  if(!urlParam){
    $state.go('dashboard.assignment');
  }
  var cardsLength, card, url, audiofile, audio, percentage, words, getAudio, initialaudio;
  var user = firebase.auth().currentUser;
  var decoded = decodeURIComponent(urlParam);
  var deck = firebase.database().ref('assignmentsStudent');
  var apikey;
  var firstword;
  var getApikey = firebase.database().ref('apikey').once("value", function(dataSnapshot){
    apikey = dataSnapshot.val();
  });
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
    firstword = $scope.assignment.words[0].expression;
    getAudio = ForvoPronunciation.getSoundfile(apikey, firstword);
    console.log(firstword);
    getAudio.then(function(response){
      audio = new Audio(response.data.items[0].pathmp3);
    });
  });

  $scope.getWord = function(word){
     getAudio = ForvoPronunciation.getSoundfile(apikey, word);
     getAudio.then(function(response){
       audio = new Audio(response.data.items[0].pathmp3);
     });
  };


  $scope.playAudio = function(){
      audio.play();
  };


  $scope.index = 0;
  $scope.answer = {'opacity': 0};
  $scope.counter = 0;
  $scope.hide = false;
  $scope.progressPercentage = 0;
  $scope.listeningWrong = false;
  $scope.listeningRight = false;
  $scope.listening = false;
  $scope.showText = {'opacity': 1};
  $scope.setClass = '';
  $scope.showText = '';

  $scope.showCorrectExpression = function(userAnswer, currentWord){
    $scope.setClass = 'shrink';
    $scope.showText = 'showText';
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
    $scope.setClass = '';
    $scope.listeningRight = false;
    $scope.listeningWrong = false;
    $scope.listening = false;
    $scope.showText = '';
    $scope.progressPercentage += card;
    $scope.index = $scope.index + 1;
    $scope.answer = {'opacity': 0, 'transition': 'none'};
    if($scope.index >= cardsLength){
      $scope.hide = true;
      console.log("You got " + $scope.counter + " out of " + cardsLength + " right!");
    }
  }

}]);
