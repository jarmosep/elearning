app.controller('CreateTeacherQuizCtrl', ['authFactory', '$scope', '$rootScope', function(authFactory, $scope, $rootScope){
  $scope.quizzes = [];
  $scope.addQuiz = function(quiztype){

    $scope.quizzes.push(quiztype);

  };

  $scope.submit = function(){
    console.log($rootScope.multipleQuestionOptions);
  }

}]);
