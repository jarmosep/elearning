/****************************************************************************************
Angular module - initializing dependencies, which the application will use.
- ui.router offers flexible routing with nested views in AngularJS
- ngSanitize module provides functionality to sanitize HTML.
- ngAnimate module provides support for CSS- and (partially) JS-based animations.
****************************************************************************************/

var app = angular.module('eLearning', ['ui.router', 'ngSanitize', 'ngAnimate']);

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
            templateUrl: 'templates/mainviews/wordbank.html'
        })

        .state('dashboard.assignments', {
            templateUrl: 'templates/mainviews/assignment.html'
        })

        .state('dashboard.addword', {
            templateUrl: 'templates/mainviews/addword.html'
        })

        .state('dashboard.askteacher', {
            templateUrl: 'templates/mainviews/ask.html'
        });
        // urlRouterProvider redirects back to landing page, if url doesn't match /dashboard
        $urlRouterProvider.otherwise('/');
}]);

app.controller('AllWordsCtrl', ['$scope', function($scope){
  $scope.limit = 5;
  $scope.showMore = function(){
    $scope.limit += 5;
  }
  $scope.words = [
    {
      japanese: "深い",
      english: "Deep",
      tags: [
        "i-adjective",
        "Common"
      ]
    },
    {
      japanese: "ダサい",
      english: "Lame",
      tags: [
        "i-adjective",
        "Common",
        "Slang"
      ]
    },
    {
      japanese: "行う",
      english: "To conduct, to carry out",
      tags: [
        "Verb",
        "Common"
      ]
    },
    {
      japanese: "モバイル最適化",
      english: "Mobile optimization",
      tags:[
        "Noun",
        "Suru-verb"
      ]
    },
    {
      japanese: "招待",
      english: "Invitation",
      tags:[
        "Noun",
        "Slang",
        "No-adjective"
      ]
    },
    {
      japanese: "行く",
      english: "To go",
      tags:[
        "Verb",
        "Common",
        "Godan-verb"
      ]
    },
    {
      japanese: "全く",
      english: "Wholly, completely, really",
      tags:[
        "Adverb",
        "No-adjective",
        "Common"
      ]
    },
    {
      japanese: "自殺",
      english: "Suicide",
      tags:[
        "Noun",
        "Suru-verb",
        "Common"
      ]
    },
    {
      japanese: "オタク",
      english: "Geek, nerd, 'enthusiast'",
      tags:[
        "Noun",
        "Common",
        "Colloquialism"
      ]
    },
    {
      japanese: "土方",
      english: "Construction worker, laborer",
      tags:[
        "Noun",
        "Sensitive"
      ]
    },
    {
      japanese: "めんどくさい",
      english: "Can't be bothered, troublesome",
      tags: [
        "i-adjective",
        "Common"
      ]
    },
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

app.directive('recentActivity',function(){
  return{
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: "../templates/mainviews/partials/frontpage/recentactivity.html"
  }
});

app.directive('word', function(){
  return{
    restrict: 'E',
    scope: {
      word: '='
    },
    templateUrl: '../templates/mainviews/partials/wordbank/word.html'
  };
});
