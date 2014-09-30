app.controller('editCtrl', function($scope, $timeout, mediator){
  $scope.data = null;
  $scope.newData = null;
  $scope.remove = function(){
    if(!$scope.data){
      return;
    }
    mediator.publish('remove', $scope.data.id);
  };
  $scope.update = function(data){
    if(!$scope.data){
      return;
    }
    mediator.publish('update', $scope.data);
  };
  $scope.create = function(){
    if(!$scope.data){
      return;
    }
    mediator.publish('create', $scope.data);
    $scope.data = null;
  };
  mediator.subscribe('selected', function(data){
    $timeout(function(){
      $scope.data = angular.copy(data);
    }, 0)
  });
});