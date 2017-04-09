app.controller("WordDetailsCtrl", ["$scope", "$http","$state", '$stateParams', '$timeout', 'kanjiSearch', 'authFactory', 'ForvoPronunciation', function($scope, $http, $state, $stateParams, $timeout, kanjiSearch, authFactory, ForvoPronunciation){
  var urlParam = $stateParams.word;
  if(!urlParam){
    $state.go('dashboard.wordbank');
  }
  var user = firebase.auth().currentUser;
  var decoded = decodeURIComponent(urlParam);
  var word = firebase.database().ref('wordbank');
  var apikey;
  $scope.loading = true;

    var getApikey = firebase.database().ref('apikey').once("value", function(dataSnapshot){
      apikey = dataSnapshot.val();
    });

    var wordbank = word.orderByChild("meaning").equalTo(decoded).once("value", function(dataSnapshot) {
    var worddata = dataSnapshot.val();
    $scope.word = worddata[Object.keys(worddata)];

    var letters = $scope.word.expression.split("");
    $scope.kanjis = [];
    $scope.results = [];

    for(var i=0; i < letters.length; i++){
      if(letters[i].match(/^[\u4e00-\u9faf]+$/)){
        $scope.kanjis.push(letters[i]);
      }
    }
    var url, audiofile, audio;
    var getAudio = ForvoPronunciation.getSoundfile(apikey, $scope.word.expression);

    getAudio.then(function(response){
      audio = new Audio(response.data.items[0].pathmp3);
    });

    $scope.playAudio = function(){
        audio.play();
    };

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

    $timeout(function(){
      $scope.loading = false;
    }, 0);
  });
}]);
