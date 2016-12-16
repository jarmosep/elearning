app.controller('AllWordsCtrl', ['$scope', '$rootScope', '$timeout', '$state', function($scope, $rootScope, $timeout, $state){
  $scope.limit = 5;
  $scope.showMore = function(){
    $scope.limit += 5;
    $timeout(function() {
          var scroller = document.getElementsByTagName('body')[0];
          scroller.scrollTop = scroller.scrollHeight;
        }, 0, false);
  }

  $scope.go = function(word) {
    console.log(word);
    $state.go('dashboard.word', {obj:word});
  }

  $scope.words = [];
  $scope.filters = [];

  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      var defaultTags = firebase.database().ref('defaultTags');
      var word = firebase.database().ref('users').child(user.uid + '/wordbank');
      word.once('value', function(snapshot){
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
        $scope.words.push(recentObj);
        console.log($scope.words);
      };
      defaultTags.once('value', function(snapshot){
        console.log(snapshot.val());
        $scope.filters.push(snapshot.val());
      });
    }else{
      console.log("Not logged in.");
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
  });


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
      filters = $scope.activeFilters.sort(),
      tags;

      for (var i=0, x=words.length; i < x; i++) {
          tags = words[i].tags.sort();
          var subset = filters.every(function(val) {
              return tags.indexOf(val) >= 0;
          });

          words[i].visible = subset;
      }
  };
}]);
