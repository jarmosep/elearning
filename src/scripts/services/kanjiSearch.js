app.factory('kanjiSearch', ['$http', function($http){
  return {
    getAllKanjis: function(){
      var response = $http(
        {
          url: '../api/kanjidict.json',
          method: 'GET',
          dataType: 'jsonp',
          contentType: 'jsonp'
        }
    );
    response.then(function(data){
          return response.data;
      });
      return response;
    }
  };
}]);
