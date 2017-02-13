app.factory('createDeck', function createDeck(){

  createDeck.submitDeck = function(newDeck){
    var user = firebase.auth().currentUser;
    if(user){
      var assignments = firebase.database().ref('users').child(user.uid + '/assignments');
      assignments.push(newDeck);
    }else{
      console.log("Erorrs");
    }
  }
  return createDeck;

});
