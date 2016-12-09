app.directive('activity', function(){
  return{
    restrict: 'E',
    scope: {
      recent: '='
    },
    templateUrl: "templates/mainviews/partials/frontpage-activity.html"
  }
});
