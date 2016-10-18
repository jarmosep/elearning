/****************************************************************************************
Angular module - initializing dependencies, which the application will use.
- ui.router offers flexible routing with nested views in AngularJS
- ngSanitize module provides functionality to sanitize HTML.
- ngAnimate module provides support for CSS-based animations.
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
            templateUrl: 'templates/partials/frontpage.html'
        })

        .state('dashboard.wordbank', {
            templateUrl: 'templates/partials/wordbank.html'
        })

        .state('dashboard.assignments', {
            templateUrl: 'templates/partials/assignment.html'
        })

        .state('dashboard.addword', {
            templateUrl: 'templates/partials/addword.html'
        })

        .state('dashboard.askteacher', {
            templateUrl: 'templates/partials/ask.html'
        });
        // urlRouterProvider redirects back to landing page, if url matches none from above
        $urlRouterProvider.otherwise('/');
}]);

app.controller('DashboardCtrl', ['$scope', '$state', function($scope, $state){
    $scope.state = $state;
}]);
