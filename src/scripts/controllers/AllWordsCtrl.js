app.controller('AllWordsCtrl', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){
  $scope.limit = 5;
  $scope.showMore = function(){
    $scope.limit += 5;
    $timeout(function() {
          var scroller = document.getElementById("autoscroll");
          scroller.scrollTop = scroller.scrollHeight;
        }, 0, false);
  }

  $scope.words = [
    {
      id: 1,
      japanese: "深い",
      english: "Deep",
      tags: [
        "I-adjective",
        "Common"
      ]
    },
    {
      id: 2,
      japanese: "ダサい",
      english: "Lame",
      tags: [
        "I-adjective",
        "Common",
        "Slang"
      ]
    },
    {
      id: 3,
      japanese: "行う",
      english: "To conduct, to carry out",
      tags: [
        "Verb",
        "Common"
      ]
    },
    {
      id: 4,
      japanese: "モバイル最適化",
      english: "Mobile optimization",
      tags:[
        "Noun",
        "Suru-verb"
      ]
    },
    {
      id: 5,
      japanese: "招待",
      english: "Invitation",
      tags:[
        "Noun",
        "No-adjective",
        "Suru-verb"
      ]
    },
    {
      id: 6,
      japanese: "行く",
      english: "To go",
      tags:[
        "Verb",
        "Common",
        "Godan-verb"
      ]
    },
    {
      id: 7,
      japanese: "全く",
      english: "Wholly, completely, really",
      tags:[
        "Adverb",
        "No-adjective",
        "Common"
      ]
    },
    {
      id: 8,
      japanese: "自殺",
      english: "Suicide",
      tags:[
        "Noun",
        "Suru-verb",
        "Common"
      ]
    },
    {
      id: 9,
      japanese: "オタク",
      english: "Geek, nerd, 'enthusiast'",
      tags:[
        "Noun",
        "Common",
        "Colloquialism"
      ]
    },
    {
      id: 10,
      japanese: "土方",
      english: "Construction worker, laborer",
      tags:[
        "Noun",
        "Sensitive"
      ]
    },
    {
      id: 11,
      japanese: "めんどくさい",
      english: "Can't be bothered, troublesome",
      tags: [
        "I-adjective",
        "Common"
      ]
    },
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
