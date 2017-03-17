app.controller('WordSubmitCtrl', ['$scope', 'addWord', '$timeout', function($scope, addWord, $timeout){
  $scope.form = {};
  $scope.tags = [];
  $scope.currentUser;
  var user = firebase.auth().currentUser;

  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      var currentUser = firebase.database().ref('users').child(user.uid);
      currentUser.once('value', function(snapshot){
        var snapshot = snapshot.val();
            console.log(snapshot);
            $scope.currentUser = snapshot.displayName;
          });
    }else{
      console.log("Not logged in.");
    }
  });

  $scope.onSubmit = function(){
    if(!$scope.form.sentences){
      $scope.form.sentences = 'No example sentences given.';
    }
    if(!$scope.form.reading){
      $scope.form.reading = '';
    }
    var newWord = {
      expression: $scope.form.expression,
      reading: $scope.form.reading,
      meaning: $scope.form.meaning,
      tags: $scope.form.selectedItem,
      sentences: $scope.form.sentences,
      createdBy: $scope.currentUser
    };
    var date = Math.floor(Date.now());
    var newAction = {
      activity: $scope.currentUser + ' added ' + $scope.form.expression+' to the wordbank',
      timestamp: date,
      addedBy: $scope.currentUser
    }
    var tags = $scope.form.selectedItem;
    console.log(tags);
    addWord.submitWord(newWord, newAction, tags);
    $scope.form = null;
  }
  $scope.clearFields = function(){
    $scope.form = null;
  }

  if(user){
    var tagbank = firebase.database().ref('tagbank');
    tagbank.on('value', function(snapshot){
      $scope.tags = snapshot.val();
      console.log($scope.tags);
    });
    $scope.selectedItem = $scope.tags[0];
  }else{
    console.log("not logged in");
  }
}]);
