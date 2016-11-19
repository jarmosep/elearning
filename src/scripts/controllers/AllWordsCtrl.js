app.controller('AllWordsCtrl', ['$scope', '$rootScope', '$timeout', '$state', function($scope, $rootScope, $timeout, $state){
  $scope.limit = 5;
  $scope.showMore = function(){
    $scope.limit += 5;
    $timeout(function() {
          var scroller = document.getElementsByTagName('body')[0];
          scroller.scrollTop = scroller.scrollHeight;
        }, 0, false);
  }

  $scope.go = function(word) {
    console.log(word);
    $state.go('dashboard.word', {obj:word});
  }

  $scope.words = [
    {
      japanese: "深い",
      english: "Deep",
      reading: "ふかい",
      image: "",
      maturity: 0,
      tags: [
        "I-adjective",
        "Common"
      ]
    },
    {
      japanese: "ダサい",
      english: "Lame",
      reading: "",
      image: "",
      maturity: 0,
      tags: [
        "I-adjective",
        "Common",
        "Slang"
      ]
    },
    {
      japanese: "行う",
      english: "To conduct, to carry out",
      reading: "おこなう",
      image: "",
      maturity: 0,
      tags: [
        "Verb",
        "Common"
      ]
    },
    {
      japanese: "歩行者天国",
      english: "pedestrian mall, car-free mall",
      reading: "ほこうしゃてんごく",
      image: "",
      maturity: 0,
      tags: [
        "Noun",
        "Common"
      ]
    },
    {
      japanese: "モバイル最適化",
      english: "Mobile optimization",
      reading: "もばいるさいてきか",
      sentence: "日本のWebサイトと中で、モバイル最適化は新興の技術だと思う。 - I think mobile optimization is a rising technology in Japanese websites.",
      image: "",
      maturity: 0,
      tags:[
        "Noun",
        "Suru-verb"
      ]
    },
    {
      japanese: "憂鬱",
      english: "Depression, melancholy, gloom",
      reading: "ゆううつ",
      image: "",
      maturity: 0,
      tags:[
        "Na-adjective",
        "Noun"
      ]
    },
    {
      japanese: "行く",
      english: "To go",
      reading: "いく",
      image: "",
      maturity: 0,
      tags:[
        "Verb",
        "Common",
        "Godan-verb"
      ]
    },
    {
      japanese: "全く",
      english: "Wholly, completely, really",
      reading: "まったく",
      image: "",
      maturity: 0,
      tags:[
        "Adverb",
        "No-adjective",
        "Common"
      ]
    },
    {
      japanese: "自殺",
      english: "Suicide",
      reading: "じさつ",
      image: "",
      maturity: 0,
      tags:[
        "Noun",
        "Suru-verb",
        "Common"
      ]
    },
    {
      japanese: "オタク",
      english: "Geek, nerd, 'enthusiast'",
      reading: "",
      image: "",
      maturity: 0,
      tags:[
        "Noun",
        "Common",
        "Colloquialism"
      ]
    },
    {
      japanese: "土方",
      english: "Construction worker, laborer",
      reading: "どかた",
      maturity: 0,
      tags:[
        "Noun",
        "Sensitive"
      ]
    },
    {
      japanese: "めんどくさい",
      english: "Can't be bothered, troublesome",
      reading: "",
      image: "",
      maturity: 0,
      tags: [
        "I-adjective",
        "Common"
      ]
    }
  ];
  $scope.filters = [
          "Noun",
          "Godan-verb",
          "Slang",
          "No-adjective",
          "I-adjective",
          "Sensitive",
          "Verb",
          "Colloquialism",
          "Suru-verb",
          "Adverb"
      ];

  $rootScope.activeFilters = [];

  $scope.toggleFilter = function($event, filter) {
      var element = angular.element($event.currentTarget),
          index = $rootScope.activeFilters.indexOf(filter)
      if (index >= 0) {
          $rootScope.activeFilters.splice(index, 1);
          element.removeClass('active');
          $scope.updateWords();
      } else {
          $rootScope.activeFilters.push(filter);
          element.addClass('active');
          $scope.updateWords();
      }
  };

  $scope.updateWords = function() {
      var words = $scope.words,
      filters = $scope.activeFilters.sort(),
      tags;

      for (var i=0, x=words.length; i < x; i++) {
          tags = words[i].tags.sort();
          var subset = filters.every(function(val) {
              return tags.indexOf(val) >= 0;
          });

          words[i].visible = subset;
      }
  };
}]);
