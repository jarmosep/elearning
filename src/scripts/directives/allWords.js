app.directive('allWords', function(){
  return{
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: '../templates/mainviews/partials/wordbank/allwords.html'
  };
});
