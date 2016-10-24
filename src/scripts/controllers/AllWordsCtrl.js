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
      japanese: "深い",
      english: "Deep",
      tags: [
        "I-adjective",
        "Common"
      ]
    },
    {
      japanese: "ダサい",
      english: "Lame",
      tags: [
        "I-adjective",
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
        "No-adjective",
        "Suru-verb"
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
