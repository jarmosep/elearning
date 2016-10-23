app.directive('recentActivity',function(){
  return{
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: "../templates/mainviews/partials/recentactivity.html"
  }
});
