/****************************************************************************************
Angular module - initializing dependencies, which the application will use.
- ui.router offers flexible routing with nested views in AngularJS
- ngSanitize module provides functionality to sanitize HTML.
- ngAnimate module provides support for CSS- and (partially) JS-based animations.
****************************************************************************************/

var app = angular.module('eLearning', ['ui.router', 'firebase', 'ngSanitize', 'ngAnimate']);

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
      var date = Math.floor(Date.now());
      wordbank.push({
        expression: expression,
        reading: reading,
        meaning: meaning,
        sentences: sentences,
        tags: tags,
        dateAdded: date
      });
      var recentActivities = firebase.database().ref('users').child(user.uid + '/recentActivity');
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

app.factory('kanjiSearch', ['$http', function($http){
  return {
    getAllKanjis: function(){
      var response = $http(
        {
          url: '../api/kanjidict.json',
          method: 'GET',
          dataType: 'jsonp',
          contentType: 'jsonp'
        }
    );
    response.then(function(data){
          return response.data;
      });
      return response;
    }
  };
}]);

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAQCgMuMpoQvh6wlJbVp14t68pOq76y-Kk",
  authDomain: "elearning-1c775.firebaseapp.com",
  databaseURL: "https://elearning-1c775.firebaseio.com",
  storageBucket: "elearning-1c775.appspot.com",
  messagingSenderId: "595697014369"
};
firebase.initializeApp(config);

// Initializing default tags
var defaultTags = firebase.database().ref('defaultTags');
var tags = ['adjective-i', 'adjective-na', 'adverb', 'auxiliary', 'conjunction', 'common', 'expression',
            'noun', 'particle', 'ichidan-verb', 'godan-verb', 'transitive', 'intransitive', 'suru-verb',
            'kuru-verb', 'colloquialism', 'honorific', 'onomatopoeic', 'slang', 'vulgar', 'sensitive'];
defaultTags.set(tags);

/****************************************************************************************
Routing unit - used to alternate between different views through nested states.
****************************************************************************************/

// stateProvider and urlRouterProvider are part of the angular ui-library
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider // stateProvider changes UI view upon an action
        .state('landing', {
            url: '/', // when state is 'landing', url is redirected to root
            templateUrl: 'templates/landing.html', // in this state, landingpage.html is being used.
            controller: 'LoginCtrl'
        })
        .state('dashboard', {
            url: '/dashboard',
            abstract: true, // abstract: {boolean} provides inherited properties to its common children states.
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardCtrl'
        })
        .state('dashboard.front', {
            url: '',
            page: 'DashboardFront',
            templateUrl: 'templates/mainviews/frontpage.html',
            controller: 'RecentActivityCtrl'
        })

        .state('dashboard.wordbank', {
            templateUrl: 'templates/mainviews/wordbank.html',
            controller: 'AllWordsCtrl'
        })

        .state('dashboard.word', {
            url: '/word',
            templateUrl: 'templates/mainviews/singleword.html',
            controller: 'WordDetailsCtrl',
            params: {
                obj: null
            }
        })

        .state('dashboard.addword', {
            templateUrl: 'templates/mainviews/addword.html',
            controller: 'WordSubmitCtrl'
        })

        .state('dashboard.quiz', {
            templateUrl: 'templates/mainviews/quiz.html',
            controller: 'QuizCtrl'
        })

        .state('dashboard.assignments', {
            templateUrl: 'templates/mainviews/assignment.html',
            controller: 'AssignmentsCtrl'
        })

        .state('dashboard.askteacher', {
            templateUrl: 'templates/mainviews/ask.html'
        });
        // urlRouterProvider redirects back to landing page, if url doesn't match /dashboard
        $urlRouterProvider.otherwise('/');
}]);

app.controller('AllWordsCtrl', ['$scope', '$rootScope', '$timeout', '$state', function($scope, $rootScope, $timeout, $state){
  $scope.limit = 5;
  $scope.showMore = function(){
    $scope.limit += 5;
    $timeout(function() {
          var scroller = document.getElementsByTagName('body')[0];
          scroller.scrollTop = scroller.scrollHeight;
        }, 0, false);
  }

  $scope.go = function(word) {
    console.log(word);
    $state.go('dashboard.word', {obj:word});
  }

  $scope.words = [];
  $scope.filters = [];

  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      var defaultTags = firebase.database().ref('defaultTags');
      var word = firebase.database().ref('users').child(user.uid + '/wordbank');
      word.once('value', function(snapshot){
        var snap = snapshot.val();
        angular.forEach(snap, function(value, key) {
          var recentObj = {
            "data": value,
            "key": key
          };
          $timeout(function(){

            update(recentObj);
          });
        });
      });
      function update(recentObj){
        $scope.words.push(recentObj);
        console.log($scope.words);
      };
      defaultTags.once('value', function(snapshot){
        console.log(snapshot.val());
        $scope.filters.push(snapshot.val());
      });
    }else{
      console.log("Not logged in.");
    }

    $scope.removeWord = function(key, index){
        console.log($scope.words.indexOf(index));
        $rootScope.popkey = null;
        $scope.words.splice($scope.words.indexOf(index),1);
        var wordbank = firebase.database().ref('users').child(user.uid + '/wordbank');
        console.log(wordbank.child(key));

        var promise = wordbank.child(key).remove();
        promise.then(function(){
          console.log('kaik män');

        }).catch(function(e){
          console.log(e);
        });
    };
  });


  $rootScope.activeFilters = [];

  $scope.toggleFilter = function($event, filter) {
      var element = angular.element($event.currentTarget),
          index = $rootScope.activeFilters.indexOf(filter)
      if (index >= 0) {
          $rootScope.activeFilters.splice(index, 1);
          element.removeClass('active');
          $scope.updateWords();
      } else {
          $rootScope.activeFilters.push(filter);
          element.addClass('active');
          $scope.updateWords();
      }
  };

  $scope.updateWords = function() {
      var words = $scope.words,
      filters = $scope.activeFilters.sort(),
      tags;

      for (var i=0, x=words.length; i < x; i++) {
          tags = words[i].tags.sort();
          var subset = filters.every(function(val) {
              return tags.indexOf(val) >= 0;
          });

          words[i].visible = subset;
      }
  };
}]);

app.controller("AssignmentsCtrl", ["$scope", function($scope){
  $scope.assignments = [
    {
      title: "Basic Japanese - Quiz 4/8",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus ad soluta perspiciatis totam incidunt officiis doloribus!",
      due: "29.11.2016 18:30",
      completed: false,
      grade: ""
    },
    {
      title: "Basic Japanese - Quiz 3/8",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus ad soluta perspiciatis totam incidunt officiis doloribus!",
      due: "22.11.2016 18:30",
      completed: true,
      grade: "A"
    },
    {
      title: "Basic Japanese - Quiz 2/8",
      description: "Necessitatibus ad soluta perspiciatis totam incidunt officiis doloribus! Lorem ipsum dolor sit amet, consectetur adipisicing elit. ",
      due: "15.11.2016 18:30",
      completed: true,
      grade: "S"
    },
    {
      title: "Basic Japanese - Quiz 1/8",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      due: "15.11.2016 18:30",
      completed: true,
      grade: "S"
    },
    {
      title: "Listening comprehension 1/2",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus ad soluta perspiciatis totam incidunt officiis doloribus!",
      due: "7.11.2016 18:30",
      completed: true,
      grade: "C"
    }
  ];
}]);

app.controller('DashboardCtrl', ['$scope', '$state', '$timeout', 'authFactory', function($scope, $state, $timeout, authFactory){
    $scope.state = $state;
    $scope.obj = {};
    console.log(firebase);
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        var currentUser = firebase.database().ref('users').child(user.uid);
        currentUser.on('value', function(snapshot){
          $timeout(function(){
            $scope.obj = {
              "displayName": snapshot.val().displayName
            }
          }, 0);
        });
      }else{
        console.log("Not logged in.");
      }
    });


    $scope.logout = function(){
      var promise = firebase.auth().signOut(); // signing the user out
      promise.then(function(){
        $state.go('landing'); // redirecting back to landingpage
      });
    };

}]);

app.controller('LoginCtrl', ['authFactory', '$scope', function(authFactory, $scope){
  $scope.signup = function(email, passwd, username){
    authFactory.signup(email, passwd, username);
  };
  $scope.login = function(email, passwd){
    authFactory.login(email, passwd);
  }
}]);

app.controller('RecentActivityCtrl', ['$rootScope', '$scope', '$timeout', function($rootScope, $scope, $timeout){
  $scope.recents = [];
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        var activity = firebase.database().ref('users').child(user.uid + '/recentActivity');
        activity.once('value', function(snapshot){
          var snap = snapshot.val();
          angular.forEach(snap, function(value, key) {
            var recentObj = {
              "data": value,
              "key": key
            };
            $timeout(function(){

              update(recentObj);
            });
          });
        });
        function update(recentObj){
          $scope.recents.push(recentObj);
          console.log($scope.recents);
        };
      }else{
        console.log("Not logged in.");
      }

      $scope.removeActivity = function(key, index){
          $rootScope.popkey = null;
          console.log(index);
          $scope.recents.splice($scope.recents.indexOf(index),1);
          var recentActivities = firebase.database().ref('users').child(user.uid + '/recentActivity');
          console.log(recentActivities.child(key));
          var promise = recentActivities.child(key).remove();
          promise.then(function(){
            console.log('kaik män');

          }).catch(function(e){
            console.log(e);
          });
      }
    });


}]);

app.filter('unique', function() {
   return function(collection, keyname) {
      var output = [],
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});

app.controller("WordDetailsCtrl", ["$scope", "$state", '$stateParams', 'kanjiSearch', function($scope, $state, $stateParams, kanjiSearch){
  $scope.word = $stateParams.obj;
  console.log($scope.word.data.expression);
  var letters = $scope.word.data.expression.split("");
  $scope.kanjis = [];
  $scope.results = [];

  for(var i=0; i < letters.length; i++){
    if(letters[i].match(/^[\u4e00-\u9faf]+$/)){
      $scope.kanjis.push(letters[i]);
    }
  }

  $scope.searchCharacter = function(kanjis){
    var getAllKanjis = kanjiSearch.getAllKanjis();
    getAllKanjis.then(function(data){ // get all the data from the dictionary
        if($scope.kanjis.length >= 1){ //if the word contains kanjis, execute the following
          for(var i=0; i<$scope.kanjis.length; i++){
            var matchingKanji = data.data.filter(function(wordobj){
              return wordobj.literal[0] == kanjis[i]; //get the corresponding kanji
            });

            if(matchingKanji){
              var results = [];
              results = matchingKanji[0];
              console.log(results);
              $scope.results.push(results);
            }
          }
      }
    });
  }

  $scope.chinese = function(reading){
    return reading.$.r_type == "ja_on";
  };

  $scope.japanese = function(reading){
    return reading.$.r_type == "ja_kun";
  };

  if(!$scope.kanjis.length == 0){
    $scope.searchCharacter($scope.kanjis);
  }else{
    console.log("No kanjis here.");
  }
}]);

app.controller('WordSubmitCtrl', ['$scope', 'addWord', function($scope, addWord){
  $scope.form = {};

  $scope.onSubmit = function(expression, reading, meaning, tags, sentences){
    addWord.submitWord(expression, reading, meaning, tags, sentences);
    $scope.form = null;
  }
  $scope.clearFields = function(){
    $scope.form = null;
  }
}]);

app.directive('activity', function(){
  return{
    restrict: 'E',
    scope: {
      recent: '='
    },
    templateUrl: 'templates/mainviews/partials/frontpage-activity.html',
  }
});

app.directive('assignment', function(){
  return{
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    templateUrl: 'templates/mainviews/partials/assignment-test.html'
  }
});

app.directive("outsideClick", ['$document', '$parse', function($document, $parse) {
	return {
    restrict: 'A',
    link: function(scope, elem, attr, ctrl) {
      elem.bind('click', function(e) {
        // this part keeps it from firing the click on the document.
        e.stopPropagation();
      });
      $document.bind('click', function() {
        // magic here.
        scope.$apply(attr.outsideClick);
      })
    }
  }
}]);

app.directive('word', function(){
  return{
    restrict: 'E',
    scope: {
      word: '='
    },
    templateUrl: "templates/mainviews/partials/wordbank-wordblock.html"
  };
});
