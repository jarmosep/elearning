app.controller('AllWordsCtrl', ['$scope', function($scope){
  $scope.words = [
    {
      japanese: "深い",
      english: "Deep",
      tag: [
        "i-adjective",
        "Common"
      ]
    },
    {
      japanese: "ダサい",
      english: "Lame",
      tag: [
        "i-adjective",
        "Common",
        "Slang"
      ]
    },
    {
      japanese: "行う",
      english: "To conduct, to carry out",
      tag: [
        "Verb",
        "Common"
      ]
    },
    {
      japanese: "モバイル最適化",
      english: "Mobile optimization",
      tag:[
        "Noun",
        "Suru-verb"
      ]
    },
    {
      japanese: "招待",
      english: "Invitation",
      tag:[
        "Noun",
        "Slang",
        "No-adjective"
      ]
    }
  ];
}]);
