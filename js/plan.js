var planProto = {
  init: function(scope){
    this.$scope = scope;
    this.createStage();
    this.renderItems();
    this.attachEvents();
    return this;
  },
  createStage: function(){
    this.canvas = document.getElementById('plan');
    this.stage = new fabric.Canvas(this.canvas, {
      hoverCursor: 'pointer',
      selection: false,
    });
    this.stage.setBackgroundImage('images/main-bg.jpg', this.stage.renderAll.bind(this.stage));
  },
  refresh:function(){
    this.stage.clear();
    this.renderItems();
  },
  attachEvents: function(){
    this.stage.on('object:selected', function(e){
      var item = e.target;
      item.setColor('blue');
      if(this.selectedItem){
        this.unselectItem(this.selectedItem);
      }
      this.selectItem(item);
    }.bind(this)).on('selection:cleared', function(){
      if(this.selectedItem){
        this.unselectItem(this.selectedItem);
        this.options.onClear();
      }
    }.bind(this)).on('object:modified', function(e){
      var item = e.target;
      item.data.position = {top: item.top, left: item.left};
    });
  },
  renderItems: function(){
    this.$scope.people.forEach(function(item){
      this.renderItem(item);
    }.bind(this));
  },
  renderItem: function(data){
    var item = new fabric.Circle({
      fill: 'red',
      hasControls: false,
      hasBorders: false,
      lockMovementX: false,
      lockMovementY: false,
      radius: 8,
      originY: 'center',
      originX: 'center',
      top: data.position.top,
      left: data.position.left,
      data: data
    });
    this.stage.add(item);
  },
  selectItem: function(item){
    this.selectedItem = item;
    item.setColor('blue');
    this.options.onSelected(item);
  },
  unselectItem: function(item){
    this.selectedItem = null;
    item.setColor('red');
  },
  setItem: function(data){
    var item = _.find(this.stage.getObjects(), {data: {id: data.id}});
    this.stage.setActiveObject(item);
    this.stage.renderAll();
  }
};

function Plan(opts){
  var res = Object.create(planProto);
  res.options = opts;
  return res;
}