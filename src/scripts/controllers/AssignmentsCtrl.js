app.controller('AssignmentsCtrl', ['$scope', '$timeout','authFactory', '$state', function($scope, $rootScope, $timeout, authFactory, $state){
  $scope.assignments = [];
  var user = firebase.auth().currentUser;
  $scope.loading = true;
  $scope.currentUser;
  $scope.currentUser = function(){
    return $rootScope.ActiveUser;
    console.log($rootScope.ActiveUser);
  }
  $scope.modalShown = false;
  $scope.toggleModal = function(deckName) {
    $scope.modal = { deckName:deckName };
    deckName ? $scope.modalShown = true : $scope.modalShown = false;
  };
  $scope.tab = 1;
  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  }
  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  }

  if(user){
    var currentUser = firebase.database().ref('users').child(user.uid);
    currentUser.once('value', function(snapshot){
      var snapshot = snapshot.val();
          $scope.currentUser = snapshot.displayName;
          console.log($scope.currentUser);
    });
    var assignments = firebase.database().ref('assignmentsStudent');
    assignments.once('value', function(snapshots){
      var snap = snapshots.val();
      angular.forEach(snap, function(value, key) {
        var recentObj = {
          "cardData": value,
          "key": key,
          "visible": true
        };
        $scope.assignments.push(recentObj);
        console.log($scope.assignments);
        $scope.loading = false;
      });
    });


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
    var assignment = firebase.database().ref('assignmentsStudent').child(key);
    var promise = assignment.remove();
    console.log(assignment.child(key));
    promise.then(function(){
      console.log('bye');
    }).catch(function(e){
      console.log(e);
    });
  };

}]);
