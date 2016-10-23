app.directive('word', function(){
  return{
    restrict: 'E',
    scope: {
      word: '='
    },
    templateUrl: '../templates/mainviews/partials/word.html'
  };
});
