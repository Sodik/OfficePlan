;(function(){
  var Data = [{
      name: 'Alex',
      x: 100,
      y: 200
    },{
      name: 'Bob',
      x: 200,
      y: 100
    }
  ];
  var counter = 0;
  var fakeMethods = {
    keyMask: '#000000',
    generateKey: function(){
      counter += 100;
      return this.keyMask.slice(-counter.toString().length) + counter;
    },
    componentToHex: function(c){
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHex: function(data){
        return "#" + componentToHex(data[0]) + componentToHex(data[1]) + componentToHex(data[2]);
    }

  }

  console.log(fakeMethods.generateKey())
  var Canvas = React.createClass({
    render: function(){
      return React.DOM.canvas({
        id: this.props.id,
        width: this.props.width || 500,
        height: this.props.height || 300
      });
    },
    shouldComponentUpdate: function(){
      return false;
    },
    componentDidMount: function(){
      this.el = this.getDOMNode();
      this.ctx = this.el.getContext('2d');
      this.renderItems();
    },
    renderItems: function(){
      this.el.style.width = this.el.width;
      this.props.data.map(function(item){
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(item.x, item.y, 20, 20);
      }.bind(this));
    },
    keyMask: '#000000',
    generateKey: function(){
      counter += 100;
      return this.keyMask.slice(-counter.toString().length) + counter;
    },
    componentToHex: function(c){
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHex: function(data){
        return "#" + componentToHex(data[0]) + componentToHex(data[1]) + componentToHex(data[2]);
    }
  });
  var Plan = React.createClass({
    render: function(){
      return React.DOM.div({
        id: 'plan'
      }, 
        Canvas({ref: 'canvas', id: 'planCanvas', data: this.props.data}),
        Canvas({ref: 'fake', id: 'fakeCanvas', data: this.props.data}, fakeMethods)
      );
    },
    componentDidMount: function(){
      this.page = document;
      this.canvas = this.refs.canvas.getDOMNode();
      this.fake = this.refs.fake.getDOMNode();
      this.attachEvents();
    },
    attachEvents: function(){
      console.log(this.canvas)
      this.canvas.addEventListener('mousedown', function(e){
        
      });
    }
  });
  var OfficePlan = React.createClass({
    render: function(){
      return  Plan({data: this.props.collection});
    }
  });
  React.renderComponent(OfficePlan({collection: Data}), document.body);
})();