app.factory('getUserInfo', function getUserInfo(){

  var user = firebase.auth().currentUser;

  getUserInfo.getUidForWords = function(){
    if(user){
      var userwords = firebase.database().ref('users').child(user.uid + '/wordbank');
      return userwords;
    }else{
      return false;
    }
  };
  return getUserInfo;

});
