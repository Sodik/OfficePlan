app.factory('mediator', function(){
  return {
    subscribers: {},
    subscribe: function(event, fn){
      this.subscribers[event] = this.subscribers[event] || [];
      this.subscribers[event].push(fn);
    },
    publish: function(event, data){
      if(!this.subscribers[event]){
        return;
      }
      this.subscribers[event].forEach(function(fn){
        fn(data);
      });
    }
  }
});