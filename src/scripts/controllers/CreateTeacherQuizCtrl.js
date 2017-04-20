app.controller('CreateTeacherQuizCtrl', ['authFactory', 'submitTeacherQuiz', '$scope', function(authFactory, submitTeacherQuiz, $scope){
  $scope.quizzes = [];
  $scope.items = [];
  $scope.addQuiz = function(quiztype){
    $scope.quizzes.push(quiztype);
  };

  $scope.sentenceFaults = [];
  $scope.multipleQuestionOptions = [];


  $scope.addNewFault = function(index, value){

    if (!$scope.items[index].sentenceFaults) {
      $scope.items[index]['sentenceFaults'] = [];
    }
    $scope.items[index].sentenceFaults.push(value);
    console.log($scope.items[index]);
    $scope.addFault = "";
  }

  $scope.moreChoices = function(index, value){

    if (!$scope.items[index].multipleQuestionOptions) {
      $scope.items[index]['multipleQuestionOptions'] = [];
    }
    $scope.items[index].multipleQuestionOptions.push(value);
    console.log($scope.items[index]);
    $scope.addFault = "";
  }
  $scope.addToCorrect = function(index, option){
    if (!$scope.items[index].correctOption) {
      $scope.items[index]['correctOption'] = [];
    }
    if($scope.items[index].correctOption.includes(option)){
      $scope.items[index]['correctOption'].splice($scope.items[index]['correctOption'].indexOf(option),1);
      console.log($scope.items[index]);
    }else{
      $scope.items[index].correctOption.push(option);
      console.log($scope.items[index]);
    }
  }

  $scope.removeChoice = function(index, value){
    $scope.items[index]['multipleQuestionOptions'].splice($scope.items[index]['multipleQuestionOptions'].indexOf(value),1);
    $scope.items[index]['correctOption'].splice($scope.items[index]['correctOption'].indexOf(value),1);
  }


  $scope.submit = function(){
    submitTeacherQuiz.submit({'quizName':$scope.quizName, 'quizDescription':$scope.quizDescription, 'quizItems': $scope.items});
    console.log($scope.items);
    $scope.items = [];
    $scope.quizzes = [];
  }

}]);
