app.controller('loginCtrl', function($scope){
  $scope.signIn = function(){
    if($scope.login && $scope.password){
      console.log(111)
    }
  }
});