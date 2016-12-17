app.controller('RecentActivityCtrl', ['authFactory', '$rootScope', '$scope', '$timeout', function(authFactory, $rootScope, $scope, $timeout){
  $scope.recents = [];
    var getAuth = authFactory.auth();
    var user = getAuth.currentUser;
    console.log(user);
      if(user){
        var activity = firebase.database().ref('users').child(user.uid + '/recentActivity');
        activity.once('value', function(snapshot){
          var snap = snapshot.val();
          angular.forEach(snap, function(value, key) {
            var recentObj = {
              "data": value,
              "key": key
            };
            $timeout(function(){

              update(recentObj);
            });
          });
        });
        function update(recentObj){
          $scope.recents.push(recentObj);
        };
      }else{
        console.log("Not logged in.");
      }

      $scope.removeActivity = function(key, index){
          $rootScope.popkey = null;
          console.log(index);
          $scope.recents.splice($scope.recents.indexOf(index),1);
          var recentActivities = firebase.database().ref('users').child(user.uid + '/recentActivity');
          console.log(recentActivities.child(key));
          var promise = recentActivities.child(key).remove();
          promise.then(function(){
            console.log('kaik män');

          }).catch(function(e){
            console.log(e);
          });
      }


}]);
/*
app.filter('unique', function() {
   return function(collection, keyname) {
      var output = [],
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});
*/
