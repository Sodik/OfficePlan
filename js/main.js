;(function(){
  var Data = [{
      firstName: 'Alex',
      secondName: 'SecondName',
      position: 'builder',
      top: 100,
      left: 200
    },{
      firstName: 'Bob',
      secondName: 'SecondName',
      position: 'builder',
      top: 300,
      left: 100
    },{
      firstName: 'Alex2',
      secondName: 'SecondName',
      position: 'builder',
      top: 100,
      left: 300
    },{
      firstName: 'Bob2',
      secondName: 'SecondName',
      position: 'builder',
      top: 100,
      left: 100
    },{
      firstName: 'Alex3',
      secondName: 'SecondName',
      position: 'builder',
      top: 100,
      left: 400
    },{
      firstName: 'Bob3',
      secondName: 'SecondName',
      position: 'builder',
      top: 20,
      left: 100
    },{
      firstName: 'Alex4',
      secondName: 'SecondName',
      position: 'builder',
      top: 10,
      left: 200
    },{
      firstName: 'Bob4',
      secondName: 'SecondName',
      position: 'builder',
      top: 250,
      left: 100
    },{
      firstName: 'Alex5',
      secondName: 'SecondName',
      position: 'builder',
      top: 150,
      left: 200
    },{
      firstName: 'Bob5',
      secondName: 'SecondName',
      position: 'builder',
      top: 200,
      left: 500
    }];
  var Info = React.createClass({
    render: function(){
      console.log('Info rendering')
      return React.DOM.div({
          id: 'info'
        },
        this.renderItems(),
        React.DOM.button({
            ref: 'mode',
            id: 'mode-btn',
            onMouseDown: this.props.clickHandler
          },
          this.getText()
        )
      );
    },

    getText: function(){
      return this.props.adminMode ? 'Admin': 'User';
    },

    renderItems: function(){
      return _.map(this.props.fields, _.bind(function(fieldName){
        return React.DOM.input({
          ref: fieldName,
          name: fieldName,
          onChange: this.props.onChange,
          disabled: !this.props.adminMode
        });
      }, this));
    },

    componentDidMount: function(){
      this.getDOMNode().addEventListener('click', function(e){
        e.stopPropagation();
      }, false);
    }
  });
  var Plan = React.createClass({
    keyMask: '#000000',
    counter: 0,

    render: function(){
      console.log('Plan rendering')
      return React.DOM.div({
         id: 'plan'
        },
        React.DOM.canvas({
          ref: 'canvas',
          id: 'canvas',
          width: 600,
          height: 300,
          onMouseDown: this.dragStart
        }),
        React.DOM.canvas({
          ref: 'fake-canvas',
          id: 'fake-canvas',
          width: 600,
          height: 300
        })
      );
    },

    componentDidMount: function(){
      this.canvas = this.refs['canvas'].getDOMNode();
      this.ctx = this.canvas.getContext('2d');
      this.fakeCanvas = this.refs['fake-canvas'].getDOMNode();
      this.fakeCtx = this.fakeCanvas.getContext('2d');
      this.canvasOffset = getOffset(this.canvas);

      this.renderItems();
    },

    renderItems: function(){
      this.canvas.width = this.canvas.width;
      this.fakeCanvas.width = this.canvas.width;
      this.counter = 0;
      this.fakeItems = {};
      _.forEach(this.props.collection, _.bind(function(item){
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(item.left, item.top, this.props.width, this.props.height);

        var key = this.generateKey();
        this.fakeItems[key] = item;

        this.fakeCtx.fillStyle = key;
        this.fakeCtx.fillRect(item.left, item.top, this.props.width, this.props.height);
      }, this));
    },

    getCoords: function(e){
      return {
        left: e.pageX - this.canvasOffset.left,
        top: e.pageY - this.canvasOffset.top
      }
    },

    dragStart: function(e){
      this.coords = this.getCoords(e);
      this.currentItem = this.getItem(this.fakeCtx.getImageData(this.coords.left, this.coords.top, 1, 1));
      if(this.currentItem){
        this.props.onSelected(this.currentItem);
        document.addEventListener('click', this.clickOutside, false);
        if(!this.props.adminMode) return;
        this.shift = {
          top: e.pageY - this.canvasOffset.top - this.currentItem.top,
          left: e.pageX - this.canvasOffset.left - this.currentItem.left
        };
        this.canvas.addEventListener('mousemove', this.dragMove, false);
        document.addEventListener('mouseup', this.dragEnd, false);
      }
    },

    dragEnd: function(){
      this.canvas.removeEventListener('mousemove', this.dragMove);
      document.removeEventListener('mouseup', this.dragEnd, false);
    },

    dragMove: function(e){
      if(this.currentItem){
        this.currentItem.top = Math.min(Math.max(e.pageY - this.shift.top - this.canvasOffset.top, 0), this.canvas.height - this.props.height);
        this.currentItem.left = Math.min(Math.max(e.pageX - this.shift.left - this.canvasOffset.left, 0), this.canvas.width - this.props.width);
        this.renderItems();
      }
    },

    clickOutside: function(e){
      this.coords = this.getCoords(e);
      if(e.target !== this.canvas || !this.getItem(this.fakeCtx.getImageData(this.coords.left, this.coords.top, 1, 1))){
        this.currentItem = null;
        this.props.onSelected(false);
        document.removeEventListener('click', this.clickOutside);
      }
    },

    changeItem: function(name, value){
      if(this.currentItem){
        this.currentItem[name] = value;
      }
    },

    getItem: function(imageData){
      var color = this.rgbToHex(imageData.data);
      return this.fakeItems[color];
    },

    generateKey: function(data){
      this.counter+= 100;
      return this.keyMask.slice(0, 7 - this.counter.toString().length) + this.counter;
    },

    componentToHex: function(c){
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    },

    rgbToHex: function(data){
        return '#' + this.componentToHex(data[0]) + this.componentToHex(data[1]) + this.componentToHex(data[2]);
    },

    shouldComponentUpdate: function(){
      return false;
    }
  });
  var OfficePlan = React.createClass({
    render: function(){
      console.log('OfficePlan rendering')
      return React.DOM.div({
          id: 'app'
        },
        Plan({
          collection: Data,
          width: 20,
          height: 20,
          onSelected: this.selectedHandler,
          adminMode: this.state.adminMode,
          ref: 'plan'
        }),
        Info({
          onChange: this.changeHandler,
          adminMode: this.state.adminMode,
          clickHandler: this.buttonHandler,
          fields: ['firstName', 'secondName', 'position'],
          ref: 'info'
        })
      );
    },

    getInitialState: function(){
      return {
        adminMode: false,
        selectedItem: false
      };
    },

    componentDidMount: function(){
      this.plan = this.refs.plan;
      this.info = this.refs.info;
    },

    changeHandler: function(e){
      var target = e.target;
      var name = target.name;
      var value = target.value;

      this.refs.plan.changeItem(name, value);
    },

    selectedHandler: function(obj){
      for(var key in this.info.refs){
        if(obj[key]){
          this.info.refs[key].getDOMNode().value = obj[key];
        }else{
          this.info.refs[key].getDOMNode().value = '';
        }
      }
    },

    buttonHandler: function(){
      this.setState({
        adminMode: !this.state.adminMode
      });
    }
  });
  React.renderComponent( OfficePlan(), document.body );

  function getOffset(obj) {
    if(obj.getBoundingClientRect){
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      var clientLeft = document.documentElement.clientLeft || document.body.clientLeft || 0;
      var clientTop = document.documentElement.clientTop || document.body.clientTop || 0;
      return {
        top:Math.round(obj.getBoundingClientRect().top + scrollTop - clientTop),
        left:Math.round(obj.getBoundingClientRect().left + scrollLeft - clientLeft)
      }
    }else{
      var posLeft = 0, posTop = 0;
      while (obj.offsetParent) {posLeft += obj.offsetLeft; posTop += obj.offsetTop; obj = obj.offsetParent;}
      return {top:posTop,left:posLeft};
    }
  }
})();