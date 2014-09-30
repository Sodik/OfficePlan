app.controller('planCtrl', function($scope, mediator){
  var plan;
  $scope.$watch('people', function(newVal, oldVal){
    if(!plan && newVal){
      $scope.selectedItem = null;
      var plan = Plan({
        onSelected: function(item){
          mediator.publish('selected', item.data);
        },
        onClear: function(){
          mediator.publish('selected', null);
        }
      }).init($scope);
      mediator.subscribe('removed', function(){
        plan.refresh();
      });
      mediator.subscribe('create', function(){
        plan.refresh();
      });
      mediator.subscribe('search', function(item){
        if(!item){
          return;
        }
        plan.setItem(item);
      });
    }
  });
});