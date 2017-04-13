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
