app.controller('LoginCtrl', ['authFactory', '$scope', function(authFactory, $scope){
  $scope.signup = function(email, passwd, username){
    authFactory.signup(email, passwd, username);
  };
  $scope.login = function(email, passwd){
    authFactory.login(email, passwd);
  }
}]);
