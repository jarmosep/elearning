app.controller('LoginCtrl', ['authFactory', '$scope', function(authFactory, $scope){
  $scope.signup = function(email_register, passwd_register, username_register, forvo_register){
    authFactory.signup(email_register, passwd_register, username_register, forvo_register);
  };
  $scope.login = function(email_login, passwd_login){
    authFactory.login(email_login, passwd_login);
  }
  $scope.tab = 1;
  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  }
  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  }
}]);
