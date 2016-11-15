app.controller("WordDetailsCtrl", ["$scope", "$state", '$stateParams', 'kanjiSearch', function($scope, $state, $stateParams, kanjiSearch){
  $scope.word = $stateParams.obj;
  var letters = $scope.word.japanese.split("");
  $scope.kanjis = [];
  $scope.results = []

  for(var i=0; i < letters.length; i++){
    if(letters[i].match(/^[\u4e00-\u9faf]+$/)){
      $scope.kanjis.push(letters[i]);
    }
  }

  $scope.searchCharacter = function(kanjis){
    var getAll = kanjiSearch.getAll();
    getAll.then(function(data){ // get all the data from the dictionary
        if($scope.kanjis.length >= 1){ //if the word contains kanjis, execute the following
          for(var i=0; i<$scope.kanjis.length; i++){
          var result = data.data.filter(function(wordobj){
            return wordobj.literal[0] == kanjis[i]; //get the corresponding kanji
          });
          //todo: get meanings and readings.
          if(result){
            $scope.results.push(result);
          }
        }
      }
    });
  }
  if(!$scope.kanjis.length == 0){
    $scope.searchCharacter($scope.kanjis);
  }else{
    console.log("No kanjis here.");
  }
}]);
