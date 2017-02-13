app.directive('addToDeck', function(){
  return {
     link: function($scope, $element) {
           $scope.$watch('deckEnable', function() {
               $element.on('click', function(e) {
                  if ($scope.deckEnable) {
                     e.preventDefault();
                     e.stopImmediatePropagation();
                     e.stopPropagation();

                     function toggleArrayItem(a, v) {
                        var i = a.indexOf(v);
                        if (i === -1){
                            a.push(v);
                            console.log(a);
                        }else{
                            a.splice(i,1);
                            console.log(a);
                          }
                    }
                    toggleArrayItem($scope.collection,$scope.word.data);
                     // tähä sit vaa kortin valinta scripts
                    $scope.$apply(function(){
                      $scope.selectedWord = !$scope.selectedWord;
                    });
                 }
               });
               if(!$scope.deckEnable){
                 $scope.selectedWord = false;
                 $scope.collection.length = 0;
               }
           });


     }
   };
});
