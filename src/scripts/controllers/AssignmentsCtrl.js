app.controller('AssignmentsCtrl', ['$scope', '$timeout','authFactory', '$state', function($scope,$timeout, authFactory, $state){
  $scope.assignments = [];
  var getAuth = authFactory.auth();
  var user = getAuth.currentUser;
  $scope.loading = true;

  if(user){
    var assignments = firebase.database().ref('users').child(user.uid + '/assignments');
    assignments.once('value', function(snapshots){
      var snap = snapshots.val();
      angular.forEach(snap, function(value, key) {
        var recentObj = {
          "cardData": value,
          "key": key,
          "visible": true
        };
        $timeout(function(){
          update(recentObj);
          $scope.loading = false;
        });
      });
    });
    function update(recentObj){
      $scope.assignments.push(recentObj);
      console.log($scope.assignments);
    };
  }else{
    console.log("Not logged in.");
  }

  $scope.go = function(assignment) {
    console.log(assignment);
    $state.go('dashboard.quiz', {obj:assignments.cardData.words});
  }

  $scope.removeAssignment = function(key, index){
    console.log($scope.assignments.indexOf(index));
    $scope.assignments.splice($scope.assignments.indexOf(index),1);
    var assignments = firebase.database().ref('users').child(user.uid + '/assignments');
    var promise = assignments.child(key).remove();
    console.log(assignments.child(key));
    promise.then(function(){
      console.log('kaik män');
    }).catch(function(e){
      console.log(e);
    });
  };

}]);
