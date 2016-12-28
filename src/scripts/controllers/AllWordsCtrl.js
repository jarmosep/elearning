app.controller('AllWordsCtrl', ['authFactory', '$scope', '$rootScope', '$timeout', '$state', function(authFactory, $scope, $rootScope, $timeout, $state){
  $scope.words = [];
  $scope.filters = [];
  $scope.limit = 5;
  $scope.loading = true;
  $scope.showMore = function(){
    $scope.limit += 5;
    $timeout(function() {
          var scroller = document.getElementsByTagName('body')[0];
          scroller.scrollTop = scroller.scrollHeight;
        }, 0, false);
  }

  var getAuth = authFactory.auth();
  var user = getAuth.currentUser;

  if(user){
    var word = firebase.database().ref('users').child(user.uid + '/wordbank');
    var userTags = firebase.database().ref('users').child(user.uid + '/tagbank');
    word.once('value', function(snapshots){
      var snap = snapshots.val();
      angular.forEach(snap, function(value, key) {
        var recentObj = {
          "data": value,
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
      $scope.words.push(recentObj);
    };

    userTags.once('value', function(snapshot){
      var tags = snapshot.val();
      console.log(tags);
      $scope.filters.push(tags);
    });


  }else{
    console.log("Not logged in.");
  }

  $scope.go = function(word) {
    console.log(word);
    $state.go('dashboard.word', {obj:word.data.expression});
  }

  $scope.removeWord = function(key, index){
      console.log($scope.words.indexOf(index));
      $rootScope.popkey = null;
      $scope.words.splice($scope.words.indexOf(index),1);
      var wordbank = firebase.database().ref('users').child(user.uid + '/wordbank');
      console.log(wordbank.child(key));

      var promise = wordbank.child(key).remove();
      promise.then(function(){
        console.log('kaik män');

      }).catch(function(e){
        console.log(e);
      });
  };

  $rootScope.activeFilters = [];

  $scope.toggleFilter = function($event, filter) {
      var element = angular.element($event.currentTarget),
          index = $rootScope.activeFilters.indexOf(filter)
      if (index >= 0) {
          $rootScope.activeFilters.splice(index, 1);
          element.removeClass('active');
          $scope.updateWords();
      } else {
          $rootScope.activeFilters.push(filter);
          element.addClass('active');
          $scope.updateWords();
      }
  };

  $scope.updateWords = function() {
      var words = $scope.words,
      filters = $rootScope.activeFilters.sort(),
      tags;
      for (var i=0, x=words.length; i < x; i++) {
          tags = words[i].data.tags.sort();
          var subset = filters.every(function(val) {
              return tags.indexOf(val) >= 0;
          });
          words[i].visible = subset;
      }
  };

}]);
