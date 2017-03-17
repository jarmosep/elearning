app.factory('createDeck', function createDeck(){

  createDeck.submitDeck = function(newDeck){
    var user = firebase.auth().currentUser;
    if(user){
      var assignments = firebase.database().ref('assignmentsStudent');
      assignments.push(newDeck);
    }else{
      console.log("Erorrs");
    }
  }
  return createDeck;

});
