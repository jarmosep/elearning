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
  $scope.words = [
    {
      japanese: "深い",
      english: "Deep",
      tag: [
        "i-adjective",
        "Common"
      ]
    },
    {
      japanese: "ダサい",
      english: "Lame",
      tag: [
        "i-adjective",
        "Common",
        "Slang"
      ]
    },
    {
      japanese: "行う",
      english: "To conduct, to carry out",
      tag: [
        "Verb",
        "Common"
      ]
    },
    {
      japanese: "モバイル最適化",
      english: "Mobile optimization",
      tag:[
        "Noun",
        "Suru-verb"
      ]
    },
    {
      japanese: "招待",
      english: "Invitation",
      tag:[
        "Noun",
        "Slang",
        "No-adjective"
      ]
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

app.directive('allWords', function(){
  return{
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: '../templates/mainviews/partials/wordbank/allwords.html'
  };
});

app.directive('recentActivities',function(){
  return{
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: "../templates/mainviews/partials/frontpage/recentactivities.html"
  }
});
