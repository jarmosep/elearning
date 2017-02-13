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
