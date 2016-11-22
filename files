/****************************************************************************************
Angular module - initializing dependencies, which the application will use.
- ui.router offers flexible routing with nested views in AngularJS
- ngSanitize module provides functionality to sanitize HTML.
- ngAnimate module provides support for CSS- and (partially) JS-based animations.
****************************************************************************************/

var app = angular.module('eLearning', ['ui.router', 'firebase', 'ngSanitize', 'ngAnimate']);

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

app.factory('kanjiSearch', ['$http', function($http){
  return {
    getAll: function(){
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
            templateUrl: 'templates/mainviews/frontpage.html'
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

  $scope.words = [
    {
      japanese: "深い",
      english: "Deep",
      reading: "ふかい",
      image: "",
      maturity: 0,
      tags: [
        "I-adjective",
        "Common"
      ]
    },
    {
      japanese: "ダサい",
      english: "Lame",
      reading: "",
      image: "",
      maturity: 0,
      tags: [
        "I-adjective",
        "Common",
        "Slang"
      ]
    },
    {
      japanese: "行う",
      english: "To conduct, to carry out",
      reading: "おこなう",
      image: "",
      maturity: 0,
      tags: [
        "Verb",
        "Common"
      ]
    },
    {
      japanese: "歩行者天国",
      english: "pedestrian mall, car-free mall",
      reading: "ほこうしゃてんごく",
      image: "",
      maturity: 0,
      tags: [
        "Noun",
        "Common"
      ]
    },
    {
      japanese: "モバイル最適化",
      english: "Mobile optimization",
      reading: "もばいるさいてきか",
      sentence: "日本のWebサイトと中で、モバイル最適化は新興の技術だと思う。 - I think mobile optimization is a rising technology in Japanese websites.",
      image: "",
      maturity: 0,
      tags:[
        "Noun",
        "Suru-verb"
      ]
    },
    {
      japanese: "憂鬱",
      english: "Depression, melancholy, gloom",
      reading: "ゆううつ",
      image: "",
      maturity: 0,
      tags:[
        "Na-adjective",
        "Noun"
      ]
    },
    {
      japanese: "行く",
      english: "To go",
      reading: "いく",
      image: "",
      maturity: 0,
      tags:[
        "Verb",
        "Common",
        "Godan-verb"
      ]
    },
    {
      japanese: "全く",
      english: "Wholly, completely, really",
      reading: "まったく",
      image: "",
      maturity: 0,
      tags:[
        "Adverb",
        "No-adjective",
        "Common"
      ]
    },
    {
      japanese: "自殺",
      english: "Suicide",
      reading: "じさつ",
      image: "",
      maturity: 0,
      tags:[
        "Noun",
        "Suru-verb",
        "Common"
      ]
    },
    {
      japanese: "オタク",
      english: "Geek, nerd, 'enthusiast'",
      reading: "",
      image: "",
      maturity: 0,
      tags:[
        "Noun",
        "Common",
        "Colloquialism"
      ]
    },
    {
      japanese: "土方",
      english: "Construction worker, laborer",
      reading: "どかた",
      maturity: 0,
      tags:[
        "Noun",
        "Sensitive"
      ]
    },
    {
      japanese: "めんどくさい",
      english: "Can't be bothered, troublesome",
      reading: "",
      image: "",
      maturity: 0,
      tags: [
        "I-adjective",
        "Common"
      ]
    }
  ];
  $scope.filters = [
          "Noun",
          "Godan-verb",
          "Slang",
          "No-adjective",
          "I-adjective",
          "Sensitive",
          "Verb",
          "Colloquialism",
          "Suru-verb",
          "Adverb"
      ];

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

app.controller('DashboardCtrl', ['$scope', '$state', 'authFactory', function($scope, $state, authFactory){
    $scope.state = $state;
    $scope.obj = {};
    console.log(firebase);
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        var currentUser = firebase.database().ref('users').child(user.uid);
        currentUser.on('value', function(snapshot){
          $scope.$apply(function(){
            $scope.obj = {
              "displayName": snapshot.val().displayName
            }
          })
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

app.controller('RecentActivityCtrl', ['$scope', function($scope){
  $scope.blocks = [
          {
            activity: "くそ食らえ was added to the wordbank",
            occurance: "30 min ago"
          },
          {
            activity: "帰国憂鬱 was added to the wordbank",
            occurance: "32 min ago"
          },
          {
            activity: "Teacher returned your assignment",
            occurance: "3 days ago"
          }
        ];
  }]);

app.controller("WordDetailsCtrl", ["$scope", "$state", '$stateParams', 'kanjiSearch', function($scope, $state, $stateParams, kanjiSearch){
  $scope.word = $stateParams.obj;
  var letters = $scope.word.japanese.split("");
  $scope.kanjis = [];
  $scope.results = [];

  for(var i=0; i < letters.length; i++){
    if(letters[i].match(/^[\u4e00-\u9faf]+$/)){
      $scope.kanjis.push(letters[i]);
    }
  }

  $scope.searchCharacter = function(kanjis){
    var getAll = kanjiSearch.getAll();
    getAll.then(function(data){ // get all the data from the dictionary
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

app.controller("WordSubmitCtrl", ["$scope", function($scope){
  $scope.form = {};
  $scope.onSubmit = function(){
    console.log($scope.form);
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
      data: '='
    },
    templateUrl: "templates/mainviews/partials/frontpage-activity.html"
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

app.directive('word', function(){
  return{
    restrict: 'E',
    scope: {
      word: '='
    },
    templateUrl: "templates/mainviews/partials/wordbank-wordblock.html"
  };
});
