app.controller('appCtrl', function($scope, $http, $timeout, mediator){
  $http({method: 'get', url: 'http://localhost:8080/data'}).
  success(function(data, status) {
    $scope.people = data.people;
    $scope.signIn = data.signIn;
    $scope.counter = $scope.people.length;
  });
  $scope.selectedItem = null;
  $scope.search = function(e){
    if(e.keyCode === 13){
      var str = e.target.value.toLowerCase();
      var res = null;
      for(var i = 0; i < $scope.people.length; i++){
        if($scope.people[i].info.name.toLowerCase().indexOf(str) != -1){
          res = $scope.people[i];
          break;
        }
      }
      $scope.selectedItem = res;
      mediator.publish('search', res);
    }
  }
  mediator.subscribe('remove', function(id){
    var item = _.find($scope.people, {id: id});
    $scope.people.splice($scope.people.indexOf(item), 1);
    mediator.publish('removed',null);
  });
  mediator.subscribe('update', function(data){
    var item = _.find($scope.people, {id: data.id});
    item.info = data.info;
    $timeout(function(){
      $scope.selectedItem = item;
    }, 0);
  });

  mediator.subscribe('create', function(data){
    var newItem = {
      id: ++$scope.counter,
      position: {
        top: 8,
        left: 8
      }
    };
    newItem.info = data.info;
    $scope.people.push(newItem);
  });
  mediator.subscribe('selected', function(data){
    $timeout(function(){
      $scope.selectedItem = data;
    }, 0);
  });
});