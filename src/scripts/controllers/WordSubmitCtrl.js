app.controller('WordSubmitCtrl', ['$scope', 'addWord', function($scope, addWord){
  $scope.form = {};
  $scope.tags = [];
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
      sentences: $scope.form.sentences
    };
    var date = Math.floor(Date.now());
    var newAction = {
      activity: $scope.form.expression+' added to the wordbank',
      timestamp: date
    }
    var tags = $scope.form.selectedItem;
    console.log(tags);
    addWord.submitWord(newWord, newAction, tags);
    $scope.form = null;
  }
  $scope.clearFields = function(){
    $scope.form = null;
  }

  var user = firebase.auth().currentUser;
  if(user){
    var tagbank = firebase.database().ref('users').child(user.uid + '/tagbank');
    tagbank.on('value', function(snapshot){
      $scope.tags = snapshot.val();
      console.log($scope.tags);
    });
    $scope.selectedItem = $scope.tags[0];
  }else{
    console.log("not logged in");
  }
}]);
