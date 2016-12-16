app.controller("WordDetailsCtrl", ["$scope", "$state", '$stateParams', 'kanjiSearch', function($scope, $state, $stateParams, kanjiSearch){
  $scope.word = $stateParams.obj;
  console.log($scope.word.data.expression);
  var letters = $scope.word.data.expression.split("");
  $scope.kanjis = [];
  $scope.results = [];

  for(var i=0; i < letters.length; i++){
    if(letters[i].match(/^[\u4e00-\u9faf]+$/)){
      $scope.kanjis.push(letters[i]);
    }
  }

  $scope.searchCharacter = function(kanjis){
    var getAllKanjis = kanjiSearch.getAllKanjis();
    getAllKanjis.then(function(data){ // get all the data from the dictionary
        if($scope.kanjis.length >= 1){ //if the word contains kanjis, execute the following
          for(var i=0; i<$scope.kanjis.length; i++){
            var matchingKanji = data.data.filter(function(wordobj){
              return wordobj.literal[0] == kanjis[i]; //get the corresponding kanji
            });

            if(matchingKanji){
              var results = [];
              results = matchingKanji[0];
              console.log(results);
              $scope.results.push(results);
            }
          }
      }
    });
  }

  $scope.chinese = function(reading){
    return reading.$.r_type == "ja_on";
  };

  $scope.japanese = function(reading){
    return reading.$.r_type == "ja_kun";
  };

  if(!$scope.kanjis.length == 0){
    $scope.searchCharacter($scope.kanjis);
  }else{
    console.log("No kanjis here.");
  }
}]);
