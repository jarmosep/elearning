app.factory('authFactory', ['$state', function authFactory($state){
  var userRef = firebase.database().ref('users'); // initializing 'users'
  var recentActivities = firebase.database().ref('recentActivities') // initializing 'recentActivities'
  var defaultTags = firebase.database().ref('tagbank'); // initializing 'tagbank'
  var auth = firebase.auth(); // creating authentication namespace
  var status;
  // Registration method

  authFactory.signup = function(email, passwd, username, status){
    console.log(status);
    var promise = auth.createUserWithEmailAndPassword(email, passwd); // creating username with pw in firebase
    var date = Math.floor(Date.now());
    promise.then(function(user){
      userRef.child(user.uid).set({
        displayName: username,
        email: email,
        status: status
      });
      recentActivities.child(user.uid);
      recentActivities.push({
        activity: username + ' just registered',
        timestamp: date,
        addedBy: username
      });

      var tags = ['adjective-i', 'adjective-na', 'adverb', 'auxiliary', 'conjunction', 'common', 'expression',
                  'noun', 'particle', 'ichidan-verb', 'godan-verb', 'transitive', 'intransitive', 'suru-verb',
                  'kuru-verb', 'colloquialism', 'honorific', 'onomatopoeic', 'slang', 'vulgar', 'sensitive'];
      defaultTags.set(tags);
      if(status === 'student'){
        $state.go('dashboard.front');
      }else if(status === 'teacher'){
        $state.go('dashboard.admin');
      }else{
        console.log("Can't go.");
      }
      console.log(user);
    }).catch(function(error){
      console.log(error);
    });
    return promise;
  }

  // Login method
  authFactory.login = function(email, passwd){
    var promise = auth.signInWithEmailAndPassword(email, passwd);
    promise.then(function(user){
      if(user){
        var currentUser = firebase.database().ref('users').child(user.uid);
        currentUser.once('value', function(snapshot){
          var value = snapshot.val();
          status = value.status;
          console.log(status);
          if(status === 'student'){
            $state.go('dashboard.front'); // if login is successful, redirect to frontpage
          }else if(status === 'teacher'){
            $state.go('dashboard.admin');
          }else{
            console.log("Got nowhere to go.");
          }
        });
      }

      console.log(user);
    }).catch(function(error){
      console.log(error)
    });
    return promise;
  }

  authFactory.auth = function(){
      return auth;
  }

  return authFactory;
}]);
