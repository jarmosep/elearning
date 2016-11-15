/****************************************************************************************
Angular module - initializing dependencies, which the application will use.
- ui.router offers flexible routing with nested views in AngularJS
- ngSanitize module provides functionality to sanitize HTML.
- ngAnimate module provides support for CSS- and (partially) JS-based animations.
****************************************************************************************/

var app = angular.module('eLearning', ['ui.router', 'ngSanitize', 'ngAnimate']);

app.service('kanjiSearch', ['$http', function($http){
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

/****************************************************************************************
Routing unit - used to alternate between different views through nested states.
****************************************************************************************/

// stateProvider and urlRouterProvider are part of the angular ui-library
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider // stateProvider changes UI view upon an action
        .state('landing', {
            url: '/', // when state is 'landing', url is redirected to root
            templateUrl: 'templates/landing.html' // in this state, landingpage.html is being used.
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

        .state('dashboard.assignments', {
            templateUrl: 'templates/mainviews/assignment.html',
            controller: 'AssignmentsCtrl'
        })

        .state('dashboard.addword', {
            templateUrl: 'templates/mainviews/addword.html',
            controller: 'WordSubmitCtrl'
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
          var scroller = document.getElementById("autoscroll");
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
      japanese: "招待",
      english: "Invitation",
      reading: "しょうたい",
      image: "",
      maturity: 0,
      tags:[
        "Noun",
        "No-adjective",
        "Suru-verb"
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

app.controller('DashboardCtrl', ['$scope', '$state', function($scope, $state){
    $scope.state = $state;
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
  $scope.results = []

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
          var result = data.data.filter(function(wordobj){
            return wordobj.literal[0] == kanjis[i]; //get the corresponding kanji
          });
          //todo: get meanings and readings.
          if(result){
            $scope.results.push(result);
          }
        }
      }
    });
  }
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
