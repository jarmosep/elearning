app.controller('AllWordsCtrl', ['$scope', function($scope){
  $scope.limit = 5;
  $scope.showMore = function(){
    $scope.limit += 5;
  }
  $scope.words = [
    {
      japanese: "深い",
      english: "Deep",
      tags: [
        "i-adjective",
        "Common"
      ]
    },
    {
      japanese: "ダサい",
      english: "Lame",
      tags: [
        "i-adjective",
        "Common",
        "Slang"
      ]
    },
    {
      japanese: "行う",
      english: "To conduct, to carry out",
      tags: [
        "Verb",
        "Common"
      ]
    },
    {
      japanese: "モバイル最適化",
      english: "Mobile optimization",
      tags:[
        "Noun",
        "Suru-verb"
      ]
    },
    {
      japanese: "招待",
      english: "Invitation",
      tags:[
        "Noun",
        "Slang",
        "No-adjective"
      ]
    },
    {
      japanese: "行く",
      english: "To go",
      tags:[
        "Verb",
        "Common",
        "Godan-verb"
      ]
    },
    {
      japanese: "全く",
      english: "Wholly, completely, really",
      tags:[
        "Adverb",
        "No-adjective",
        "Common"
      ]
    },
    {
      japanese: "自殺",
      english: "Suicide",
      tags:[
        "Noun",
        "Suru-verb",
        "Common"
      ]
    },
    {
      japanese: "オタク",
      english: "Geek, nerd, 'enthusiast'",
      tags:[
        "Noun",
        "Common",
        "Colloquialism"
      ]
    },
    {
      japanese: "土方",
      english: "Construction worker, laborer",
      tags:[
        "Noun",
        "Sensitive"
      ]
    },
    {
      japanese: "めんどくさい",
      english: "Can't be bothered, troublesome",
      tags: [
        "i-adjective",
        "Common"
      ]
    },
  ];
}]);
