app.factory('addWord', function addWord(){
  // Registration method
  addWord.submitWord = function(newWord,newAction,newTags){

    var user = firebase.auth().currentUser;
    if(user){
      var wordbank = firebase.database().ref('wordbank');
      var tagbank = firebase.database().ref('tagbank');
      var recentActivities = firebase.database().ref('recentActivities');
      wordbank.push(newWord);
      recentActivities.push(newAction);

      var savePreviousTags = [];
      tagbank.once('value', function (snapshot){
        var snap = snapshot.val();
        angular.forEach(snap, function(value){ // get all tags from user's individual words
          savePreviousTags.push(value); // push them into an array
        });
      });
      var setNewTags = savePreviousTags.concat(newTags);

      setNewTags = setNewTags.filter( function( item, index, inputArray ) { // check for duplicates in array...
        return inputArray.indexOf(item) == index; // ...and remove them
      });

      tagbank.set(setNewTags);

    }else{
      console.log("Errors");
    }
  }

  return addWord;

});
