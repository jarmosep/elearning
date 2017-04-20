app.controller('TeacherQuizzesCtrl', ['$scope', '$timeout','authFactory', '$state', function($scope, $timeout, authFactory, $state){
  $scope.quizzes = [];
  var user = firebase.auth().currentUser;
  $scope.loading = true;
  $scope.currentUser;


  if(user){
    var currentUser = firebase.database().ref('users').child(user.uid);
    currentUser.once('value', function(snapshot){
      var snapshot = snapshot.val();
          $scope.currentUser = snapshot.displayName;
          console.log($scope.currentUser);
    });
    var assignments = firebase.database().ref('assignmentsTeacher');
    assignments.once('value', function(snapshots){
      var snap = snapshots.val();
      angular.forEach(snap, function(value, key) {
        var recentObj = {
          "cardData": value,
          "key": key,
          "visible": true
        };
        $scope.quizzes.push(recentObj);
        console.log($scope.quizzes);
        $scope.loading = false;
      });
    });


  }else{
    console.log("Not logged in.");
  }


  $scope.removeQuizzes = function(key, index){
    console.log($scope.quizzes.indexOf(index));
    $scope.quizzes.splice($scope.quizzes.indexOf(index),1);
    var quiz = firebase.database().ref('assignmentsTeacher').child(key);
    var promise = quiz.remove();
    console.log(quiz.child(key));
    promise.then(function(){
      console.log('bye');
    }).catch(function(e){
      console.log(e);
    });
  };

}]);
