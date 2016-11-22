app.factory('authFactory', ['$state', function authFactory($state){
  var userRef = firebase.database().ref('users'); // create 'users' node in Firebase, if it doesn't exist
  var auth = firebase.auth(); // creating authentication namespace

  // Registration method
  authFactory.signup = function(email, passwd, username){
    var promise = auth.createUserWithEmailAndPassword(email, passwd); // creating username with pw in firebase
    promise.then(function(user){
      userRef.child(user.uid).set({
        displayName: username,
        recentActivities: '',
        wordbank: '',
        tags: '',
        assignments: '',
        quickMessage: '',
      });
      $state.go('dashboard.front');
      console.log(user);
    }).catch(function(err){
      console.log(err);
    });
    return promise;
  }

  // Login method
  authFactory.login = function(email, passwd){
    var promise = auth.signInWithEmailAndPassword(email, passwd);
    promise.then(function(user){
      $state.go('dashboard.front'); // if login is successful, redirect to frontpage
      console.log(user);
    }).catch(function(err){
      console.log(err)
    });
    return promise;
  }

  authFactory.auth = function(){
    console.log(currentUser);
    return auth.currentUser;
  }

  return authFactory;
}]);
