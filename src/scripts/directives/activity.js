app.directive('activity', function(){
  return{
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: "templates/mainviews/partials/frontpage-activity.html"
  }
});
