// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
;(function(){
  var cache = {};
 
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
     
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
       
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
       
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
   
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

var Mediator = {
  subscribers: {},
  subscribe: function(event, fn){
    this.subscribers[event] = this.subscribers[event] || [];
    this.subscribers[event].push(fn);
  },
  publish: function(event, data){
    console.log(event)
    this.subscribers[event].forEach(function(fn){
      fn(data);
    });
  }
}

;(function(){
  var Data = [{
      info: {
        name: 'Алексей Степченков',
        job_title: 'Developer',
        phone: '(063) 846 21 84',
        email: 'aleksey.stepchenkov@chisw.us',
        skype: 'stu_kh',
        birthday: '08/27/1990'
      },
      position: {
        top: 302,
        left: 281
      }
    },{
      info: {
        name: 'Сергей Войчук',
        job_title: 'Developer',
        phone: '(066) 67-80-140',
        email: 'sergey.voichuk@chisw.us',
        skype: 'said.enterprise',
        birthday: '10/31/1984'
      },
      position: {
        top: 236,
        left: 281
      }
    },{
      info: {
        name: 'Рита Стрельницкая',
        job_title: 'Project Manager',
        phone: '(063) 734 32 14',
        email: 'rita.strelnitskaya@chisw.us',
        skype: 'margorayk',
        birthday: '03/13/1984'
      },
      position: {
        top: 202,
        left: 281
      }
    },{
      info: {
        name: 'Дарья Гармаш',
        phone: '(099) 563 41 44',
        email: 'daria.garmash@chisw.us',
        skype: 'lutsenko.darya',
        birthday: '08/22/1987',
        job_title: 'Front-end Trainee'
      },
      position: {
        top: 138,
        left: 281
      }
    },{
      info: {
        name: 'Яромир Козак',
        phone: '(066) 770 07 34',
        email: 'yaromir.kozak@chisw.us',
        skype: 'y_a_r_o_m_i_r',
        birthday: '08/15/1991',
        job_title: 'Developer'
      },
      position: {
        top: 138,
        left: 365
      }
    }];

  var Plan = {
    init: function(options){
      this.options = options;
      this.data = Data;
      this.canvas = options.canvas;
      this.createStage();
      this.renderItems();
      this.attachEvents();
      return this;
    },
    refresh: function(adminMode){
      this.stage.clear();
      this.renderItems(adminMode);
    },
    createStage: function(){
      this.stage = new fabric.Canvas(this.canvas, {
        hoverCursor: 'pointer'
      });
      this.stage.setBackgroundImage('images/main-bg.jpg', this.stage.renderAll.bind(this.stage));
    },
    renderItems: function(adminMode){
      this.data.forEach(function(item){
        this.renderItem(item, adminMode);
      }.bind(this));
    },
    renderItem: function(data, moveable){
      var item = new fabric.Circle({
        fill: 'red',
        hasControls: false,
        hasBorders: false,
        lockMovementX: moveable,
        lockMovementY: moveable,
        radius: 8,
        originY: 'center',
        originX: 'center',
        top: data.position.top,
        left: data.position.left,
        data: data
      });
      this.stage.add(item);
    },
    createItem: function(newData, moveable){
      this.data.push(newData);
      this.renderItem(newData, moveable);
    },
    removeItem: function(item){
      var item = _.find(this.stage.getObjects(), item);
      this.data.splice(this.data.indexOf(item.data), 1);
      item.remove();
    },
    attachEvents: function(){
      var self = this;
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
      }.bind(this));
    },
    selectItem: function(item){
      this.selectedItem = item;
      item.setColor('blue');
      this.options.onSelected(item);
    },
    unselectItem: function(item){
      this.selectedItem = null;
      item.setColor('red');
    }
  }

  var Edit = {
    init: function(item){
      this.tmpl = tmpl('edit_tmpl');
      this.findElements();
      this.attachEvents();
      this.update(item);
      return this;
    },
    update: function(item){
      this.currentItem = item;
      this.contentBlock.innerHTML = this.tmpl({ data: item && item.data.info || {} });
    },
    findElements: function(){
      this.editor = document.getElementById('edit');
      this.contentBlock = this.editor.querySelector('.content');
      this.updateButton = this.editor.querySelector('#update');
      this.removeButton = this.editor.querySelector('#remove');
      this.createButton = this.editor.querySelector('#create');
    },
    attachEvents: function(){
      this.updateButton.addEventListener('click', function(){
        if(this.currentItem){
          this.updateItem();
        }
      }.bind(this), false);

      this.removeButton.addEventListener('click', function(){
        if(this.currentItem){
          this.removeItem();
        }
      }.bind(this), false);

      this.createButton.addEventListener('click', function(){
        if(!this.currentItem){
          this.createItem();
        }
      }.bind(this), false);
    },
    updateItem: function(){
      var data = {};
      Array.prototype.slice.call(this.editor.querySelectorAll('input'), 0).forEach(function(inp){
        data[inp.name] = inp.value;
      });
      this.currentItem.data.info = data;
      Mediator.publish('update', data);
    },
    createItem: function(){
      var data = { position: {top: 8, left: 8} , info: {}};
      Array.prototype.slice.call(this.editor.querySelectorAll('input'), 0).forEach(function(inp){
        data.info[inp.name] = inp.value;
      });
      Mediator.publish('create', data);
      this.reset();
    },
    removeItem: function(){
      Mediator.publish('remove', this.currentItem);
    },
    reset: function(){
      this.contentBlock.reset();
    },
    show: function(){
      this.editor.style.display = 'block';
    },
    hide: function(){
      this.editor.style.display = 'none';
    }
  };

  var App = {
    init: function(){
      this.findElements();
      this.initPlan();
      this.initSearch();
      this.initMode();
      this.initEdit();
    },
    initPlan: function(){
      var template = tmpl('info_tmpl');
      var plan = this.plan = Plan.init({
        canvas: document.getElementById('plan'),
        onSelected: function(item){
          this.currentItem = item;
          this.infoBlock.innerHTML = template( { data: item.data.info } );
          this.editor.update(this.currentItem);
        }.bind(this),
        onClear: function(){
          this.currentItem = null;
          this.infoBlock.innerHTML = '';
          this.editor.update();
        }.bind(this)
      });

      Mediator.subscribe('update', function(data){
        this.infoBlock.innerHTML = template( { data: data } );
      }.bind(this));

      Mediator.subscribe('remove', function(item){
        plan.removeItem(item)
      });

      Mediator.subscribe('create', function(newData){
        plan.createItem(newData, this.modeState);
      });
    },
    findElements: function(){
      this.infoBlock = document.getElementById('info');
    },
    initSearch: function(){
      this.searchField = document.getElementById('search');
      this.searchField.addEventListener('change', function(e){
        var str = e.target.value.toLowerCase();
        this.plan.stage.getObjects().forEach(function(item){
          var data = item.data.info;
          if(str && data.name.toLowerCase().indexOf(str) != -1){
            this.plan.stage.setActiveObject(item);
            this.plan.stage.renderAll();
          }
        }.bind(this));
      }.bind(this), false);
    },
    initMode: function(){
      this.modeState = false;
      this.modeButton = document.getElementById('mode');
      this.modeButton.addEventListener('click', function(e){
        this.modeState = !this.modeState;
        if(this.modeState){
          this.modeButton.innerHTML = 'Admin';
          this.plan.refresh();
          this.editor.show();
        }else{
          this.modeButton.innerHTML = 'User';
          this.plan.refresh(true);
          this.editor.hide();
        }
      }.bind(this), false);

    },
    initEdit: function(){
      this.editor = Edit.init();
      if(!this.modeState){
        this.editor.hide();
      }
    }
  };

  App.init();
})();