app.controller('DashboardCtrl', ['$scope', '$state', 'authFactory', function($scope, $state, $apply, authFactory){
    $scope.state = $state;
    $scope.obj = {};
    console.log(firebase);
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        var currentUser = firebase.database().ref('users').child(user.uid);
        currentUser.on('value', function(snapshot){
          $scope.$apply(function(){
            $scope.obj = {
              "displayName": snapshot.val().displayName
            }
          });
        });
      }else{
        console.log("Not logged in.");
      }
    });


    $scope.logout = function(){
      var promise = firebase.auth().signOut(); // signing the user out
      promise.then(function(){
        $state.go('landing'); // redirecting back to landingpage
      });
    };

}]);
