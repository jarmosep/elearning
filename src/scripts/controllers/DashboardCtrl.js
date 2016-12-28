app.controller('DashboardCtrl', ['$scope', '$state', '$timeout', '$window', 'authFactory', function($scope, $state, $timeout, $window, authFactory){
    $scope.state = $state;
    $scope.obj = {};
    console.log(firebase);
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        var currentUser = firebase.database().ref('users').child(user.uid);
        $window.user = authFactory.auth().currentUser;
        currentUser.on('value', function(snapshot){
          $timeout(function(){
            $scope.obj = {
              "displayName": snapshot.val().displayName
            }
          }, 0);
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
