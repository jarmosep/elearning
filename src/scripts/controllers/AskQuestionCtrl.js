app.controller('AskQuestionCtrl', ['authFactory', '$scope', function(authFactory, $scope){
  $scope.form = {};
  $scope.showQuestions = "";
  $scope.currentUser;
  $scope.tab = 1;

  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  }
  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  }

  var user = firebase.auth().currentUser;
  var currentUser;
  var studentQuestions;

  if(user){
    currentUser = firebase.database().ref('users').child(user.uid);
    studentQuestions = firebase.database().ref('studentQuestions');
    currentUser.once('value', function(snapshot){
      var snapshot = snapshot.val();
          console.log(snapshot);
          $scope.currentUser = snapshot.displayName;
    });
    studentQuestions.on('value', function(snapshot){
      var snapshot = snapshot.val();
          $scope.showQuestions = snapshot;
          console.log($scope.showQuestions);
    });
  }else{
    console.log("Not logged in.");
  }


  var date = Math.floor(Date.now());

  $scope.onSubmit = function(){
    var newQuestion = {
      type: $scope.form.questionType,
      question: $scope.form.questionText,
      askedBy: $scope.currentUser,
      date: date,
      answer: 0
    };
    studentQuestions.push(newQuestion);
    $scope.form.questionType = null;
    $scope.form.questionText = null;
  };
  $scope.answerTheQuestion = function(key, item, answerText){
    item.answer = answerText;
    console.log(key);
    var item = item.answer;
    studentQuestions.child(key).update({answer: item});
  }
}]);
