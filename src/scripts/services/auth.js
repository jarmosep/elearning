app.factory('authFactory', ['$state', function authFactory($state){
  var userRef = firebase.database().ref('users'); // initializing 'users'

  var auth = firebase.auth(); // creating authentication namespace

  // Registration method
  authFactory.signup = function(email, passwd, username){
    var promise = auth.createUserWithEmailAndPassword(email, passwd); // creating username with pw in firebase
    var date = Math.floor(Date.now());
    promise.then(function(user){
      userRef.child(user.uid).set({
        displayName: username,
        email: email,
        status: 'student'
      });
      var recentActivities = firebase.database().ref('users').child(user.uid + '/recentActivity');
      recentActivities.push({
        activity: 'You created a new account!',
        timestamp: date,
      });
      var defaultTags = firebase.database().ref('users').child(user.uid + '/tagbank');
      var tags = ['adjective-i', 'adjective-na', 'adverb', 'auxiliary', 'conjunction', 'common', 'expression',
                  'noun', 'particle', 'ichidan-verb', 'godan-verb', 'transitive', 'intransitive', 'suru-verb',
                  'kuru-verb', 'colloquialism', 'honorific', 'onomatopoeic', 'slang', 'vulgar', 'sensitive'];
      defaultTags.set(tags);
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
      return auth;
  }

  return authFactory;
}]);
