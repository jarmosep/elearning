app.directive('recentActivities',function(){
  return{
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: "../templates/mainviews/partials/frontpage/recentactivities.html"
  }
});
