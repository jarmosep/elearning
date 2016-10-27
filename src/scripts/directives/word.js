app.directive('word', function(){
  return{
    restrict: 'E',
    scope: {
      word: '='
    },
    templateUrl: "templates/mainviews/partials/wordbank-wordblock.html"
  };
});
