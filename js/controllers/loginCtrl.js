app.controller('loginCtrl', function($scope, $http){
  $scope.signIn = function(){
    if($scope.login && $scope.password){
      console.log(111)
    }
  }
});