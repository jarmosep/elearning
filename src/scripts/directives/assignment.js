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
