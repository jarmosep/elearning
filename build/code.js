/****************************************************************************************
Angular module - initializing dependencies, which the application will use.
- ui.router offers flexible routing with nested views in AngularJS
- ngSanitize module provides functionality to sanitize HTML.
- ngAnimate module provides support for CSS- and (partially) JS-based animations.
****************************************************************************************/

var app = angular.module('eLearning', ['ui.router', 'ui.select', 'firebase', 'ngSanitize', 'ngAnimate']);

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

app.factory('ForvoPronunciation', ['$http', function($http){
  return{
    getSoundfile: function(apikey, word){
      var response = $http(
        {
          url: 'http://apifree.forvo.com/key/' + apikey + '/format/json/action/standard-pronunciation/word/' + word + '/language/ja',
          method: 'GET',
          cache: 'true',
          type: 'json',
          contentType: 'json'
        }
      );
      response.then(function(data){
          console.log(data.data);
          return response.data;
      });

      return response;
    }
  };
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

        /*------------------------ */
        /*      Student views      */
        /*------------------------ */

        .state('dashboard', {
            url: '/dashboard',
            abstract: true, // abstract: {boolean} provides inherited properties to its common children states.
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardCtrl',
            resolve: {
                "currentAuth": ['$firebaseAuth', function($firebaseAuth) {
                    var au = firebase.auth();
                    var authObj = $firebaseAuth(au);
                    return authObj.$requireSignIn();
                }]
            }
        })
        .state('dashboard.front', {
            url: '',
            page: 'DashboardFront',
            templateUrl: 'templates/mainviews/frontpage.html',
            controller: 'RecentActivityCtrl'
        })
        .state('dashboard.wordbank', {
            url: '/wordbank',
            templateUrl: 'templates/mainviews/wordbank.html',
            controller: 'AllWordsCtrl',
        })
        .state('dashboard.word', {
            url: '/wordbank/word/:word',
            templateUrl: 'templates/mainviews/singleword.html',
            controller: 'WordDetailsCtrl',
            params: {
                obj: null
            }
        })
        .state('dashboard.addword', {
            url: '/addword',
            templateUrl: 'templates/mainviews/addword.html',
            controller: 'WordSubmitCtrl',
        })
        .state('dashboard.assignments', {
            url: '/assignment',
            templateUrl: 'templates/mainviews/assignment.html',
            controller: 'AssignmentsCtrl',
            params: {
                obj: null
            }
        })
        .state('dashboard.quiz-memorize', {
            url: '/memorize/:assignment',
            templateUrl: 'templates/mainviews/quiz-memorize.html',
            controller: 'MemorizeCtrl'
        })
        .state('dashboard.quiz-type', {
            url: '/type/:assignment',
            templateUrl: 'templates/mainviews/quiz-type.html',
            controller: 'TypeCtrl'
        })
        .state('dashboard.quiz-listen', {
            url: '/listen/:assignment',
            templateUrl: 'templates/mainviews/quiz-listen.html',
            controller: 'ListenCtrl'
        })
        .state('dashboard.quiz-teacher', {
            url: '/quiz/:assignment',
            templateUrl: 'templates/mainviews/quiz-teacher.html',
            controller: 'QuizCtrl'
        })
        .state('dashboard.askteacher', {
            url: '/ask',
            templateUrl: 'templates/mainviews/ask.html',
            controller: 'AskQuestionCtrl'
        })

        /*------------------------ */
        /*      Teacher views      */
        /*------------------------ */

        .state('dashboard.admin', {
            url: '/admin',
            page: 'DashboardAdmin',
            templateUrl: 'templates/mainviews/teacher-frontpage.html',
            controller: 'RecentActivityCtrl'
        })
        .state('dashboard.quizmaker', {
            url: '/admin/quizmaker',
            templateUrl: 'templates/mainviews/quizmaker.html',
            controller: 'CreateTeacherQuizCtrl'
        })
        .state('dashboard.quizzes', {
            url: '/admin/quizzes',
            templateUrl: 'templates/mainviews/teacher-quizzes.html',
            controller: 'TeacherQuizzesCtrl'
        })
        .state('dashboard.answer', {
            url: '/admin/answer',
            templateUrl: 'templates/mainviews/teacher-answer.html',
            controller: 'AskQuestionCtrl'
        });
        // urlRouterProvider redirects back to landing page, if url doesn't match /dashboard
        $urlRouterProvider.otherwise('/');

}]);

app.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        // if not signed in, redirect to login page
        if (error === "AUTH_REQUIRED") {
            $state.go('landing'); // tms login state
        }
    });
}]);

app.factory('submitTeacherQuiz', function submitTeacherQuiz(){
  // Registration method
  submitTeacherQuiz.submit = function(items){
    var user = firebase.auth().currentUser;
    var date = Math.floor(Date.now());
    var currentUser;
    if(user){
      var currentUser = firebase.database().ref('users').child(user.uid);
      currentUser.once('value', function(snapshot){
        var snapshot = snapshot.val();
        console.log(snapshot);
        currentUser = snapshot.displayName;
      });
      console.log(currentUser);
      var assignmentsTeacher = firebase.database().ref('assignmentsTeacher');
      var recentActivities = firebase.database().ref('recentActivities');
      var newAction = {
        activity: currentUser + ' added a new assignment',
        timestamp: date,
        addedBy: currentUser
      }
      assignmentsTeacher.push(items);
      recentActivities.push(newAction);

    }else{
      console.log("Errors");
    }
  }

  return submitTeacherQuiz;

});

app.controller('AllWordsCtrl', ['authFactory', 'createDeck', '$scope', '$rootScope', '$timeout', '$state', function(authFactory, createDeck, $scope, $rootScope, $timeout, $state){
  $scope.words = [];
  $scope.filters = [];
  $scope.limit = 5;
  $scope.loading = true;
  $scope.collection = [];
  $scope.currentUser;
  $scope.userStatus;
  $scope.showMore = function(){
    $scope.limit += 5;
    $timeout(function() {
          var scroller = document.getElementsByTagName('body')[0];
          scroller.scrollTop = scroller.scrollHeight;
        }, 0, false);
  }

  var getAuth = authFactory.auth();
  var user = getAuth.currentUser;

  if(user){
    var word = firebase.database().ref('wordbank');
    var userTags = firebase.database().ref('tagbank');
    word.once('value', function(snapshots){
      var snap = snapshots.val();
      angular.forEach(snap, function(value, key) {
        var recentObj = {
          "data": value,
          "key": key,
          "visible": true
        };
        $timeout(function(){
          update(recentObj);
          $scope.loading = false;
        });
      });
    });
    function update(recentObj){
      $scope.words.push(recentObj);
    };

    userTags.once('value', function(snapshot){
      var tags = snapshot.val();
      console.log(tags);
      $scope.filters.push(tags);
    });

    var currentUser = firebase.database().ref('users').child(user.uid);
    currentUser.once('value', function(snapshot){
      var snapshot = snapshot.val();
        $scope.currentUser = snapshot.displayName;
        $scope.userStatus = snapshot.status;
    });

  }else{
    console.log("Not logged in.");
  }

  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

  $scope.tab = 0;

  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  };

  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  };

  $scope.removeWord = function(key, index){
      console.log($scope.words.indexOf(index));
      $scope.words.splice($scope.words.indexOf(index),1);
      var wordbank = firebase.database().ref('wordbank').child(key);
      console.log(wordbank.child(key));

      var promise = wordbank.remove();
      promise.then(function(){
        console.log('they gone');

      }).catch(function(e){
        console.log(e);
      });
  };

  $scope.newDeck = function(deckName, description){
    var usersRoot = firebase.database().ref('assignmentsStudent');
    var date = Math.floor(Date.now());
    var deck = {
      deckName: deckName,
      description: description,
      words: $scope.collection,
      cardLength: $scope.collection.length,
      createdBy: $scope.currentUser,
      date: date
    };
    console.log(deck);
    createDeck.submitDeck(deck);
    $scope.deckName = null;
    $scope.description = null;
    $scope.collection = [];
    $scope.modalShown = false;
    $scope.selectedWord = false;
  }

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
      filters = $rootScope.activeFilters.sort(),
      tags;
      for (var i=0, x=words.length; i < x; i++) {
          tags = words[i].data.tags.sort();
          var subset = filters.every(function(val) {
              return tags.indexOf(val) >= 0;
          });
          words[i].visible = subset;
      }
  };

}]);

app.controller('AnswerQuestionsCtrl', ['authFactory', '$scope', function(authFactory, $scope){

  $scope.tab = 1;
  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  }
  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  }
}]);

app.controller('AskQuestionCtrl', ['authFactory', '$scope', function(authFactory, $scope){
  $scope.form = {};
  $scope.showQuestions = "";
  $scope.currentUser;
  $scope.tab = 1;

  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  }
  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  }

  var user = firebase.auth().currentUser;
  var currentUser;
  var studentQuestions;

  if(user){
    currentUser = firebase.database().ref('users').child(user.uid);
    studentQuestions = firebase.database().ref('studentQuestions');
    currentUser.once('value', function(snapshot){
      var snapshot = snapshot.val();
          console.log(snapshot);
          $scope.currentUser = snapshot.displayName;
    });
    studentQuestions.on('value', function(snapshot){
      var snapshot = snapshot.val();
          $scope.showQuestions = snapshot;
          console.log($scope.showQuestions);
    });
  }else{
    console.log("Not logged in.");
  }


  var date = Math.floor(Date.now());

  $scope.onSubmit = function(){
    var newQuestion = {
      type: $scope.form.questionType,
      question: $scope.form.questionText,
      askedBy: $scope.currentUser,
      date: date,
      answer: 0
    };
    studentQuestions.push(newQuestion);
    $scope.form.questionType = null;
    $scope.form.questionText = null;
  };
  $scope.answerTheQuestion = function(key, item, answerText){
    item.answer = answerText;
    console.log(key);
    var item = item.answer;
    studentQuestions.child(key).update({answer: item});
  }
}]);

app.controller('AssignmentsCtrl', ['$scope', '$rootScope', '$timeout','authFactory', '$state', function($scope, $rootScope, $timeout, authFactory, $state){
  $scope.assignments = [];
  $scope.teacherQuizzes = [];
  var user = firebase.auth().currentUser;
  $scope.loading = true;
  $scope.currentUser;
  $scope.currentUser = function(){
    return $rootScope.ActiveUser;
    console.log($rootScope.ActiveUser);
  }
  $scope.modalShown = false;
  $scope.toggleModal = function(deckName) {
    $scope.modal = { deckName:deckName };
    deckName ? $scope.modalShown = true : $scope.modalShown = false;
  };
  $scope.tab = 1;
  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  }
  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  }

  if(user){
    var currentUser = firebase.database().ref('users').child(user.uid);
    currentUser.once('value', function(snapshot){
      var snapshot = snapshot.val();
          $scope.currentUser = snapshot.displayName;
          console.log($scope.currentUser);
    });
    var assignments = firebase.database().ref('assignmentsStudent');
    assignments.once('value', function(snapshots){
      var snap = snapshots.val();
      angular.forEach(snap, function(value, key) {
        var recentObj = {
          "cardData": value,
          "key": key,
          "visible": true
        };
        $scope.assignments.push(recentObj);
        console.log($scope.assignments);
        $scope.loading = false;
      });
    });
    var teacherQuizzes = firebase.database().ref('assignmentsTeacher');
    teacherQuizzes.once('value', function(snapshots){
      var snap = snapshots.val();
      angular.forEach(snap, function(value, key) {
        var recentObj = {
          "cardData": value,
          "key": key,
          "visible": true
        };
        $scope.teacherQuizzes.push(recentObj);
        console.log($scope.teacherQuizzes);
        $scope.loading = false;
      });
    });
  }else{
    console.log("Not logged in.");
  }

  $scope.removeAssignment = function(key, index){
    console.log($scope.assignments.indexOf(index));
    $scope.assignments.splice($scope.assignments.indexOf(index),1);
    var assignment = firebase.database().ref('assignmentsStudent').child(key);
    var promise = assignment.remove();
    console.log(assignment.child(key));
    promise.then(function(){
      console.log('bye');
    }).catch(function(e){
      console.log(e);
    });
  };

}]);

app.controller('CreateTeacherQuizCtrl', ['authFactory', 'submitTeacherQuiz', '$scope', function(authFactory, submitTeacherQuiz, $scope){
  $scope.quizzes = [];
  $scope.items = [];
  $scope.addQuiz = function(quiztype){
    $scope.quizzes.push(quiztype);
  };

  $scope.sentenceFaults = [];
  $scope.multipleQuestionOptions = [];


  $scope.addNewFault = function(index, value){

    if (!$scope.items[index].sentenceFaults) {
      $scope.items[index]['sentenceFaults'] = [];
    }
    $scope.items[index].sentenceFaults.push(value);
    console.log($scope.items[index]);
    $scope.addFault = "";
  }

  $scope.moreChoices = function(index, value){

    if (!$scope.items[index].multipleQuestionOptions) {
      $scope.items[index]['multipleQuestionOptions'] = [];
    }
    $scope.items[index].multipleQuestionOptions.push(value);
    console.log($scope.items[index]);
    $scope.addFault = "";
  }
  $scope.addToCorrect = function(index, option){
    if (!$scope.items[index].correctOption) {
      $scope.items[index]['correctOption'] = [];
    }
    if($scope.items[index].correctOption.includes(option)){
      $scope.items[index]['correctOption'].splice($scope.items[index]['correctOption'].indexOf(option),1);
      console.log($scope.items[index]);
    }else{
      $scope.items[index].correctOption.push(option);
      console.log($scope.items[index]);
    }
  }

  $scope.removeChoice = function(index, value){
    $scope.items[index]['multipleQuestionOptions'].splice($scope.items[index]['multipleQuestionOptions'].indexOf(value),1);
    $scope.items[index]['correctOption'].splice($scope.items[index]['correctOption'].indexOf(value),1);
  }


  $scope.submit = function(){
    submitTeacherQuiz.submit({'quizName':$scope.quizName, 'quizDescription':$scope.quizDescription, 'quizItems': $scope.items});
    console.log($scope.items);
    $scope.items = [];
    $scope.quizzes = [];
  }

}]);

app.controller('DashboardCtrl', ['$scope', '$state', '$timeout', '$window', 'authFactory', function($scope, $state, $timeout, $window, authFactory){
    $scope.state = $state;
    $scope.navbar = "";
    $scope.obj = {};
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        var currentUser = firebase.database().ref('users').child(user.uid);
        $window.user = authFactory.auth().currentUser;
        currentUser.on('value', function(snapshot){
          $timeout(function(){
            $scope.obj = {
              "displayName": snapshot.val().displayName,
            }
            var status = snapshot.val().status;
            if(status === 'student'){
              $scope.navbar = studentNav;
            }else if(status === 'teacher'){
              $scope.navbar = teacherNav;
            }else{
              $scope.navbar = error;
            }
          }, 0);
        });

        var studentNav = [
          {
            stateName: 'dashboard.front',
            icon: 'ion-home',
            description: 'Dashboard'
          },
          {
            stateName: 'dashboard.addword',
            icon: 'ion-plus-circled',
            description: 'Add words'
          },
          {
            stateName: 'dashboard.wordbank',
            icon: 'ion-filing',
            description: 'Wordbank'
          },
          {
            stateName: 'dashboard.assignments',
            icon: 'ion-university',
            description: 'Assignments'
          },
          {
            stateName: 'dashboard.askteacher',
            icon: 'ion-chatboxes',
            description: 'Ask teacher'
          }
        ];
        var teacherNav = [
          {
            stateName: 'dashboard.admin',
            icon: 'ion-home',
            description: 'Dashboard'
          },
          {
            stateName: 'dashboard.addword',
            icon: 'ion-plus-circled',
            description: 'Add words'
          },
          {
            stateName: 'dashboard.wordbank',
            icon: 'ion-filing',
            description: 'Wordbank'
          },
          {
            stateName: 'dashboard.quizmaker',
            icon: 'ion-document-text',
            description: 'Create quiz'
          },
          {
            stateName: 'dashboard.quizzes',
            icon: 'ion-university',
            description: 'Quizzes'
          },
          {
            stateName: 'dashboard.answer',
            icon: 'ion-chatboxes',
            description: 'Answer questions'
          }
        ];

      var error = "Error";

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

app.controller("ListenCtrl", ["$scope", "$state", '$stateParams', '$timeout', 'ForvoPronunciation', function($scope, $state, $stateParams, $timeout, ForvoPronunciation){
  var urlParam = $stateParams.assignment;
  if(!urlParam){
    $state.go('dashboard.assignment');
  }
  var cardsLength, card, url, audiofile, audio, percentage, words, getAudio, initialaudio;
  var user = firebase.auth().currentUser;
  var decoded = decodeURIComponent(urlParam);
  var deck = firebase.database().ref('assignmentsStudent');
  var apikey;
  var firstword;
  var getApikey = firebase.database().ref('apikey').once("value", function(dataSnapshot){
    apikey = dataSnapshot.val();
  });
  var assignment = deck.orderByChild("deckName").equalTo(decoded).once("value", function(dataSnapshot) {
    var assignmentData = dataSnapshot.val();
    $scope.assignment = assignmentData[Object.keys(assignmentData)];
    cardsLength = $scope.assignment.words.length;
    card = (1 / cardsLength) * 100;
    var currentIndex = $scope.assignment.words.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = $scope.assignment.words[currentIndex];
      $scope.assignment.words[currentIndex] = $scope.assignment.words[randomIndex];
      $scope.assignment.words[randomIndex] = temporaryValue;
    }
    firstword = $scope.assignment.words[0].expression;
    getAudio = ForvoPronunciation.getSoundfile(apikey, firstword);
    console.log(firstword);
    getAudio.then(function(response){
      audio = new Audio(response.data.items[0].pathmp3);
    });
  });

  $scope.getWord = function(word){
     getAudio = ForvoPronunciation.getSoundfile(apikey, word);
     getAudio.then(function(response){
       audio = new Audio(response.data.items[0].pathmp3);
     });
  };


  $scope.playAudio = function(){
      audio.play();
  };


  $scope.index = 0;
  $scope.answer = {'opacity': 0};
  $scope.counter = 0;
  $scope.hide = false;
  $scope.progressPercentage = 0;
  $scope.listeningWrong = false;
  $scope.listeningRight = false;
  $scope.listening = false;
  $scope.showText = {'opacity': 1};
  $scope.setClass = '';
  $scope.showText = '';

  $scope.showCorrectExpression = function(userAnswer, currentWord){
    $scope.setClass = 'shrink';
    $scope.showText = 'showText';
    if(userAnswer == currentWord){
      $scope.showUserAnswer = userAnswer;
      $scope.listeningRight = true;
      $scope.listening = true;
      $scope.answer = {'opacity': 1};
    }else{
      $scope.showUserAnswer = userAnswer;
      $scope.listeningWrong = true;
      $scope.listening = true;
      $scope.answer = {'opacity': 1};
    }
  }

  $scope.nextWord = function(count, nextSound){
    if(count === 0){ $scope.counter += 0; }
    if(count === 1){ $scope.counter += 1; }
    $scope.setClass = '';
    $scope.listeningRight = false;
    $scope.listeningWrong = false;
    $scope.listening = false;
    $scope.showText = '';
    $scope.progressPercentage += card;
    $scope.index = $scope.index + 1;
    $scope.answer = {'opacity': 0, 'transition': 'none'};
    if($scope.index >= cardsLength){
      $scope.hide = true;
      console.log("You got " + $scope.counter + " out of " + cardsLength + " right!");
    }
  }

}]);

app.controller('LoginCtrl', ['authFactory', '$scope', function(authFactory, $scope){
  $scope.signup = function(email_register, passwd_register, username_register, status){
    authFactory.signup(email_register, passwd_register, username_register, status);
  };
  $scope.login = function(email_login, passwd_login){
    authFactory.login(email_login, passwd_login);
  }
  $scope.tab = 1;
  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  }
  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  }
}]);

app.controller("MemorizeCtrl", ["$scope", "$state", '$stateParams', '$timeout', function($scope, $state, $stateParams, $timeout){
  var urlParam = $stateParams.assignment;
  if(!urlParam){
    $state.go('dashboard.assignment');
  }
  var cardsLength, card, percentage;
  var user = firebase.auth().currentUser;
  var decoded = decodeURIComponent(urlParam);
  var deck = firebase.database().ref('assignmentsStudent');
  var assignment = deck.orderByChild("deckName").equalTo(decoded).once("value", function(dataSnapshot) {
    var assignmentData = dataSnapshot.val();
    $scope.assignment = assignmentData[Object.keys(assignmentData)];
    cardsLength = $scope.assignment.words.length;
    card = (1 / cardsLength) * 100;
    var currentIndex = $scope.assignment.words.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = $scope.assignment.words[currentIndex];
      $scope.assignment.words[currentIndex] = $scope.assignment.words[randomIndex];
      $scope.assignment.words[randomIndex] = temporaryValue;
    }
    console.log($scope.assignment);
  });

  $scope.index = 0;
  $scope.answerChoices = false;
  $scope.answer = {'opacity': 0};
  $scope.showText = "Show answer";
  $scope.quizOver = false;
  $scope.counter = 0;
  $scope.hide = false;
  $scope.progressPercentage = 0;

  $scope.showAnswer = function(){
    $scope.answer = {'opacity': 1};
    $scope.showText = "Do you remember this word?";
    $scope.answerChoices = true;
  };

  $scope.nextWord = function(count){
    if(count === 0){ $scope.counter += 0; }
    if(count === 1){ $scope.counter += 1; }
    $scope.progressPercentage += card;
    $scope.index = $scope.index + 1;
    $scope.showText = "Show answer";
    $scope.answerChoices = false;
    $scope.answer = {'opacity': 0};
    if($scope.index >= cardsLength){
      $scope.quizOver = true;
      $scope.hide = true;
      console.log("You got " + $scope.counter + " out of " + cardsLength + " right!");
    }
  }

}]);

app.controller("QuizCtrl", ["$scope", "$state", '$stateParams', '$timeout', function($scope, $state, $stateParams, $timeout){
  var urlParam = $stateParams.assignment;
  if(!urlParam){
    $state.go('dashboard.front');
  }
  var cardsLength, card, url, audio, percentage, words;
  var user = firebase.auth().currentUser;
  var decoded = decodeURIComponent(urlParam);
  var deck = firebase.database().ref('assignmentsTeacher');
  var quiz = deck.orderByChild("quizName").equalTo(decoded).once("value", function(dataSnapshot) {
    var quizData = dataSnapshot.val();
    $scope.quiz = quizData[Object.keys(quizData)];
    cardsLength = $scope.quiz.quizItems.length;
    $scope.length = cardsLength;
    card = (1 / cardsLength) * 100;
    var currentIndex = $scope.quiz.quizItems.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = $scope.quiz.quizItems[currentIndex];
      $scope.quiz.quizItems[currentIndex] = $scope.quiz.quizItems[randomIndex];
      $scope.quiz.quizItems[randomIndex] = temporaryValue;
    }

  });
  $scope.faultyItems = [];
  $scope.index = 0;
  $scope.answer = {'opacity': 0};
  $scope.answered = false;
  $scope.quizOver = false;
  $scope.quizRight = false;
  $scope.quizWrong = false;
  $scope.counter = 0;
  $scope.hide = false;
  $scope.progressPercentage = 0;

  $scope.showCorrectionAnswer = function(userAnswer, sentenceFaults){
    var comparision = userAnswer.length == sentenceFaults.length && userAnswer.every(function(element, index){
      return element === sentenceFaults[index];
    })
    console.log(comparision);
    if(comparision){
      $scope.answered = true;
      $scope.quizRight = true;
      $scope.showUserAnswer = userAnswer;
      $scope.answer = {'opacity': 1};
    }else{
      $scope.answered = true;
      $scope.quizWrong = true;
      $scope.showUserAnswer = userAnswer;
      $scope.answer = {'opacity': 1};
    }
  }

  $scope.showMultipleAnswer = function(userAnswer, correct){
    correct_fetched = correct.join();
    console.log(correct_fetched);
    if(userAnswer == correct_fetched){
      $scope.answered = true;
      $scope.quizRight = true;
      $scope.showUserAnswer = userAnswer;
      $scope.answer = {'opacity': 1};
    }else{
      $scope.answered = true;
      $scope.quizWrong = true;
      $scope.showUserAnswer = userAnswer;
      $scope.answer = {'opacity': 1};
    }
  }

  $scope.nextQuiz = function(count){
    if(count === 0){ $scope.counter += 0; }
    if(count === 1){ $scope.counter += 1; }
    $scope.quizRight = false;
    $scope.quizWrong = false;
    $scope.answered = false;
    $scope.progressPercentage += card;
    $scope.index = $scope.index + 1;
    $scope.answer = {'opacity': 0};
    if($scope.index >= cardsLength){
      $scope.quizOver = true;
      $scope.hide = true;
      console.log("You got " + $scope.counter + " out of " + cardsLength + " right!");
    }
  }

}]);

app.controller('RecentActivityCtrl', ['authFactory', '$rootScope', '$scope', '$timeout', function(authFactory, $rootScope, $scope, $timeout){
  $scope.recents = [];
    var getAuth = authFactory.auth();
    var user = firebase.auth().currentUser;
    console.log(user);
      if(user){
        var activities = firebase.database().ref('recentActivities');
        activities.once('value', function(snapshot){
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
        };
      }else{
        console.log("Not logged in.");
      }

      $scope.removeActivity = function(key, index){
          $rootScope.popkey = null;
          console.log(index);
          $scope.recents.splice($scope.recents.indexOf(index),1);
          var activity = firebase.database().ref('recentActivities').child(key);
          console.log(activity.child(key));
          var promise = activity.remove();
          promise.then(function(){
            console.log('be gone');

          }).catch(function(e){
            console.log(e);
          });
      }


}]);
/*
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
*/

app.controller('TeacherQuizzesCtrl', ['$scope', '$timeout','authFactory', '$state', function($scope, $timeout, authFactory, $state){
  $scope.quizzes = [];
  var user = firebase.auth().currentUser;
  $scope.loading = true;
  $scope.currentUser;


  if(user){
    var currentUser = firebase.database().ref('users').child(user.uid);
    currentUser.once('value', function(snapshot){
      var snapshot = snapshot.val();
          $scope.currentUser = snapshot.displayName;
          console.log($scope.currentUser);
    });
    var assignments = firebase.database().ref('assignmentsTeacher');
    assignments.once('value', function(snapshots){
      var snap = snapshots.val();
      angular.forEach(snap, function(value, key) {
        var recentObj = {
          "cardData": value,
          "key": key,
          "visible": true
        };
        $scope.quizzes.push(recentObj);
        console.log($scope.quizzes);
        $scope.loading = false;
      });
    });


  }else{
    console.log("Not logged in.");
  }


  $scope.removeQuizzes = function(key, index){
    console.log($scope.quizzes.indexOf(index));
    $scope.quizzes.splice($scope.quizzes.indexOf(index),1);
    var quiz = firebase.database().ref('assignmentsTeacher').child(key);
    var promise = quiz.remove();
    console.log(quiz.child(key));
    promise.then(function(){
      console.log('bye');
    }).catch(function(e){
      console.log(e);
    });
  };

}]);

app.controller("TypeCtrl", ["$scope", "$state", '$stateParams', '$timeout', 'ForvoPronunciation', function($scope, $state, $stateParams, $timeout, ForvoPronunciation){
  var urlParam = $stateParams.assignment;
  if(!urlParam){
    $state.go('dashboard.assignment');
  }
  var cardsLength, card, url, audiofile, audio, percentage, words, getAudio;
  var user = firebase.auth().currentUser;
  var decoded = decodeURIComponent(urlParam);
  var deck = firebase.database().ref('assignmentsStudent');
  var assignment = deck.orderByChild("deckName").equalTo(decoded).once("value", function(dataSnapshot) {
    var assignmentData = dataSnapshot.val();
    $scope.assignment = assignmentData[Object.keys(assignmentData)];
    cardsLength = $scope.assignment.words.length;
    card = (1 / cardsLength) * 100;
    var currentIndex = $scope.assignment.words.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = $scope.assignment.words[currentIndex];
      $scope.assignment.words[currentIndex] = $scope.assignment.words[randomIndex];
      $scope.assignment.words[randomIndex] = temporaryValue;
    }

  });

  $scope.index = 0;
  $scope.answer = {'opacity': 0};
  $scope.quizOver = false;
  $scope.counter = 0;
  $scope.hide = false;
  $scope.progressPercentage = 0;
  $scope.listeningWrong = false;
  $scope.listeningRight = false;
  $scope.listening = false;

  $scope.showCorrectExpression = function(userAnswer, currentWord){
    if(userAnswer == currentWord){
      $scope.showUserAnswer = userAnswer;
      $scope.listeningRight = true;
      $scope.listening = true;
      $scope.answer = {'opacity': 1};
    }else{
      $scope.showUserAnswer = userAnswer;
      $scope.listeningWrong = true;
      $scope.listening = true;
      $scope.answer = {'opacity': 1};
    }
  }

  $scope.nextWord = function(count, nextSound){
    if(count === 0){ $scope.counter += 0; }
    if(count === 1){ $scope.counter += 1; }
    $scope.listeningRight = false;
    $scope.listeningWrong = false;
    $scope.listening = false;
    $scope.progressPercentage += card;
    $scope.index = $scope.index + 1;
    $scope.answer = {'opacity': 0};
    if($scope.index >= cardsLength){
      $scope.quizOver = true;
      $scope.hide = true;
      console.log("You got " + $scope.counter + " out of " + cardsLength + " right!");
    }
  }

}]);

app.controller("WordDetailsCtrl", ["$scope", "$http","$state", '$stateParams', '$timeout', 'kanjiSearch', 'authFactory', 'ForvoPronunciation', function($scope, $http, $state, $stateParams, $timeout, kanjiSearch, authFactory, ForvoPronunciation){
  var urlParam = $stateParams.word;
  if(!urlParam){
    $state.go('dashboard.wordbank');
  }
  var user = firebase.auth().currentUser;
  var decoded = decodeURIComponent(urlParam);
  var word = firebase.database().ref('wordbank');
  var apikey;
  $scope.loading = true;

    var getApikey = firebase.database().ref('apikey').once("value", function(dataSnapshot){
      apikey = dataSnapshot.val();
    });

    var wordbank = word.orderByChild("meaning").equalTo(decoded).once("value", function(dataSnapshot) {
    var worddata = dataSnapshot.val();
    $scope.word = worddata[Object.keys(worddata)];

    var letters = $scope.word.expression.split("");
    $scope.kanjis = [];
    $scope.results = [];

    for(var i=0; i < letters.length; i++){
      if(letters[i].match(/^[\u4e00-\u9faf]+$/)){
        $scope.kanjis.push(letters[i]);
      }
    }
    var url, audiofile, audio;
    var getAudio = ForvoPronunciation.getSoundfile(apikey, $scope.word.expression);

    getAudio.then(function(response){
      audio = new Audio(response.data.items[0].pathmp3);
    });

    $scope.playAudio = function(){
        audio.play();
    };

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

    $timeout(function(){
      $scope.loading = false;
    }, 0);
  });
}]);

app.controller('WordSubmitCtrl', ['$scope', 'addWord', '$timeout', function($scope, addWord, $timeout){
  $scope.form = {};
  $scope.tags = [];
  $scope.currentUser;
  
  var user = firebase.auth().currentUser;

  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      var currentUser = firebase.database().ref('users').child(user.uid);
      currentUser.once('value', function(snapshot){
        var snapshot = snapshot.val();
            console.log(snapshot);
            $scope.currentUser = snapshot.displayName;
          });
    }else{
      console.log("Not logged in.");
    }
  });

  $scope.onSubmit = function(){
    if(!$scope.form.sentences){
      $scope.form.sentences = 'No example sentences given.';
    }
    if(!$scope.form.reading){
      $scope.form.reading = '';
    }
    var newWord = {
      expression: $scope.form.expression,
      reading: $scope.form.reading,
      meaning: $scope.form.meaning,
      tags: $scope.form.selectedItem,
      sentences: $scope.form.sentences,
      createdBy: $scope.currentUser
    };
    var date = Math.floor(Date.now());
    var newAction = {
      activity: $scope.currentUser + ' added ' + $scope.form.expression+' to the wordbank',
      timestamp: date,
      addedBy: $scope.currentUser
    }
    var tags = $scope.form.selectedItem;
    console.log(tags);
    addWord.submitWord(newWord, newAction, tags);
    $scope.form = null;
  }
  $scope.clearFields = function(){
    $scope.form = null;
  }

  if(user){
    var tagbank = firebase.database().ref('tagbank');
    tagbank.on('value', function(snapshot){
      $scope.tags = snapshot.val();
      console.log($scope.tags);
    });
    $scope.selectedItem = $scope.tags[0];
  }else{
    console.log("not logged in");
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

app.directive('addToDeck', function(){
  return {
     link: function($scope, $element) {
           $scope.$watch('deckEnable', function() {
               $element.on('click', function(e) {
                  if ($scope.isSet(2)) {
                     e.preventDefault();
                     e.stopImmediatePropagation();
                     e.stopPropagation();

                     function toggleArrayItem(a, v) {
                        var i = a.indexOf(v);
                        if (i === -1){
                            a.push(v);
                            console.log(a);
                        }else{
                            a.splice(i,1);
                            console.log(a);
                          }
                    }
                    toggleArrayItem($scope.collection,$scope.word.data);
                     // tähä sit vaa kortin valinta scripts
                    $scope.$apply(function(){
                      $scope.selectedWord = !$scope.selectedWord;
                    });
                 }else{
                   $scope.selectedWord = false;
                   $scope.collection = [];
                 }
               });

           });


     }
   };
});

app.directive('assignment', function(){
  return{
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    controller: 'AssignmentsCtrl',
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
