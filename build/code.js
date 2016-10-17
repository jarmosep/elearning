var app = angular.module('eLearning', ['ui.router', 'ngSanitize', 'ngAnimate']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('landing', {
            url: '/',
            templateUrl: 'templates/landing.html'
        })

        .state('dashboard', {
            url: '/dashboard',
            abstract: true,
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardCtrl'
        })
        .state('dashboard.front', {
            url: '',
            page: 'DashboardFront',
            templateUrl: 'templates/dashboard_parts/front.html'
        })

        .state('dashboard.wordbank', {
            templateUrl: 'templates/dashboard_parts/wordbank.html'
        })

        .state('dashboard.assignments', {
            templateUrl: 'templates/dashboard_parts/assignment.html'
        })

        .state('dashboard.addword', {
            templateUrl: 'templates/dashboard_parts/addword.html'
        })

        .state('dashboard.askteacher', {
            templateUrl: 'templates/dashboard_parts/ask.html'
        });

        $urlRouterProvider.otherwise('/');
}]);

app.controller('DashboardCtrl', ['$scope', '$state', function($scope, $state){
    $scope.state = $state;
}]);
