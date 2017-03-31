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

        .state('dashboard.assignments', {
            url: '/assignment',
            templateUrl: 'templates/mainviews/assignment.html',
            controller: 'AssignmentsCtrl',
            params: {
                obj: null
            }
        })

        .state('dashboard.askteacher', {
            url: '/ask',
            templateUrl: 'templates/mainviews/ask.html',
            controller: 'AskQuestionCtrl'
        })

        .state('dashboard.quizmaker', {
            url: '/quizmaker',
            templateUrl: 'templates/mainviews/quizmaker.html'
        });
        // urlRouterProvider redirects back to landing page, if url doesn't match /dashboard
        $urlRouterProvider.otherwise('/');

}]);

app.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        // if not signed in, redirect to login page
        if (error === "AUTH_REQUIRED") {
            $state.go('/'); // tms login state
        }
    });
}]);
