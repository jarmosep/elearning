app.controller('RecentActivityCtrl', ['$scope', '$timeout', 'authFactory', function($scope, $timeout, authFactory){
  $scope.recents = [];
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        var currentUser = firebase.database().ref('users').child(user.uid);
        currentUser.on('value', function(snapshot){
          $timeout(function(){
            update(snapshot)
          });
        });
        function update(snapshot){
          $scope.recents = snapshot.val().recentActivities;
        }
      }else{
        console.log("Not logged in.");
      }
    });
}]);
