app.controller('CreateTeacherQuizCtrl', ['authFactory', '$scope', function(authFactory, $scope){
  $scope.quizzes = [];
  $scope.addQuiz = function(quiztype){

    $scope.quizzes.push(quiztype);


  };
}]);
