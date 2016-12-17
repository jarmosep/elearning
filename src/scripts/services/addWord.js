app.factory('addWord', function addWord(){
  // Registration method
  addWord.submitWord = function(expression, reading, meaning, tags, sentences){
    if(!sentences){
      sentences = 'No example sentences given.';
    }
    if(!reading){
      reading = null;
    }
    var user = firebase.auth().currentUser;
    if(user){
      var wordbank = firebase.database().ref('users').child(user.uid + '/wordbank');
      var tagbank = firebase.database().ref('users').child(user.uid + '/tagbank');
      var recentActivities = firebase.database().ref('users').child(user.uid + '/recentActivity');
      var date = Math.floor(Date.now());
      wordbank.push({
        expression: expression,
        reading: reading,
        meaning: meaning,
        sentences: sentences,
        tags: tags,
        dateAdded: date
      });
      tagbank.push(tags);
      recentActivities.push({
        activity: expression+' added to the wordbank',
        timestamp: date
      });
    }else{
      console.log("Erorrs");
    }
  }
  return addWord;

});
