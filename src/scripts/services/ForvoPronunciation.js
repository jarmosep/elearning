app.factory('ForvoPronunciation', ['$http', function($http){
  return{
    getSoundfile: function(apikey, word){
      var response = $http(
        {
          url: 'http://apifree.forvo.com/key/' + apikey + '/format/json/action/standard-pronunciation/word/' + word + '/language/ja',
          method: 'GET',
          cache: 'true',
          type: 'json',
          contentType: 'json'
        }
      );
      response.then(function(data){
          console.log(data.data);
          return response.data;
      });

      return response;
    }
  };
}]);