app.controller("QuizCtrl", ["$scope", "$state", '$stateParams', '$timeout', function($scope, $state, $stateParams, $timeout){
  var urlParam = $stateParams.assignment;
  if(!urlParam){
    $state.go('dashboard.front');
  }
  var cardsLength, card, url, audio, percentage, words;
  var user = firebase.auth().currentUser;
  var decoded = decodeURIComponent(urlParam);
  var deck = firebase.database().ref('assignmentsTeacher');
  var quiz = deck.orderByChild("quizName").equalTo(decoded).once("value", function(dataSnapshot) {
    var quizData = dataSnapshot.val();
    $scope.quiz = quizData[Object.keys(quizData)];
    cardsLength = $scope.quiz.quizItems.length;
    $scope.length = cardsLength;
    card = (1 / cardsLength) * 100;
    var currentIndex = $scope.quiz.quizItems.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = $scope.quiz.quizItems[currentIndex];
      $scope.quiz.quizItems[currentIndex] = $scope.quiz.quizItems[randomIndex];
      $scope.quiz.quizItems[randomIndex] = temporaryValue;
    }

  });
  $scope.faultyItems = [];
  $scope.index = 0;
  $scope.answer = {'opacity': 0};
  $scope.answered = false;
  $scope.quizOver = false;
  $scope.quizRight = false;
  $scope.quizWrong = false;
  $scope.counter = 0;
  $scope.hide = false;
  $scope.progressPercentage = 0;

  $scope.showCorrectionAnswer = function(userAnswer, sentenceFaults){
    var comparision = userAnswer.length == sentenceFaults.length && userAnswer.every(function(element, index){
      return element === sentenceFaults[index];
    })
    console.log(comparision);
    if(comparision){
      $scope.answered = true;
      $scope.quizRight = true;
      $scope.showUserAnswer = userAnswer;
      $scope.answer = {'opacity': 1};
    }else{
      $scope.answered = true;
      $scope.quizWrong = true;
      $scope.showUserAnswer = userAnswer;
      $scope.answer = {'opacity': 1};
    }
  }

  $scope.showMultipleAnswer = function(userAnswer, correct){
    correct_fetched = correct.join();
    console.log(correct_fetched);
    if(userAnswer == correct_fetched){
      $scope.answered = true;
      $scope.quizRight = true;
      $scope.showUserAnswer = userAnswer;
      $scope.answer = {'opacity': 1};
    }else{
      $scope.answered = true;
      $scope.quizWrong = true;
      $scope.showUserAnswer = userAnswer;
      $scope.answer = {'opacity': 1};
    }
  }

  $scope.nextQuiz = function(count){
    if(count === 0){ $scope.counter += 0; }
    if(count === 1){ $scope.counter += 1; }
    $scope.quizRight = false;
    $scope.quizWrong = false;
    $scope.answered = false;
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
