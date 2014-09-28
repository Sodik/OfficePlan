;(function(){
  var app = angular.module('app', []);

   app.controller('appCtrl', function($scope, $rootScope){
    $scope.test = 'Test';
    $scope.people = [{
      id: 1,
      info: {
        name: 'Алексей Степченков',
        company: 'CHI Software',
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
      id: 2,
      info: {
        name: 'Сергей Войчук',
        company: 'CHI Software',
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
      id: 3,
      info: {
        name: 'Рита Стрельницкая',
        company: 'CHI Software',
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
      id: 4,
      info: {
        name: 'Дарья Гармаш',
        company: 'CHI Software',
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
      id: 5,
      info: {
        name: 'Яромир Козак',
        company: 'CHI Software',
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
    $scope.ids = [1, 2, 3, 4, 5];
    $scope.search = function(e){
      if(e.keyCode === 13){
        $rootScope.$emit('search', e.target.value.toLowerCase());
      }
    }
    setTimeout(function(){
      $scope.people.push({
      id: 6,
      info: {
        name: 'Яромир Козак',
        company: 'CHI Software',
        phone: '(066) 770 07 34',
        email: 'yaromir.kozak@chisw.us',
        skype: 'y_a_r_o_m_i_r',
        birthday: '08/15/1991',
        job_title: 'Developer'
      },
      position: {
        top: 138,
        left: 1065
      }
    });
      console.log(1111)
    }, 5000);
   });

  app.factory('mediator', function(){
    return {
      subscribers: [],
      subscribe: function(event, fn){
        this.subscribers[event] = this.subscribers[event] || [];
        this.subscribers[event].push(fn);
      },
      publish: function(event, data){
        this.subscribers[event].forEach(function(fn){
          fn(data);
        });
      }
    }
  });

   app.controller('infoCtrl', function($scope, $rootScope){
    $scope.data = null;
    $rootScope.$on('item:selected', function(e, item){
      $scope.data = item.data.info;
      $scope.$digest();
    });
    $rootScope.$on('items:unselected', function(){
      $scope.data = null;
      $scope.$digest();
    });
   });

   app.directive('officePlan', function(){
    return {
      restrict: 'E',
      template: '<canvas width="1600" height="997" id="plan"></canvas>',
      scope: {
        people: '='
      },
      controller: function($scope, $rootScope, mediator){
        console.log(mediator)

        $scope.refresh = function(adminMode){
          stage.clear();
          this.renderItems(adminMode);
        };
        $scope.renderItems = function(adminMode){
          $scope.people.forEach(function(item){
            this.renderItem(item, adminMode);
          }.bind(this));
        };
        $scope.renderItem = function(data, moveable){
          var item = new fabric.Circle({
            fill: 'red',
            hasControls: false,
            hasBorders: false,
            lockMovementX: !!moveable,
            lockMovementY: !!moveable,
            radius: 8,
            originY: 'center',
            originX: 'center',
            top: data.position.top,
            left: data.position.left,
            data: data
          });
          stage.add(item);
        };
        $scope.createItem = function(newData, moveable){
          $scope.data.push(newData);
          this.renderItem(newData, moveable);
        };
        $scope.removeItem = function(item){
          var item = _.find(stage.getObjects(), item);
          $scope.data.splice(this.data.indexOf(item.data), 1);
          item.remove();
        };
        $scope.selectItem = function(item){
          this.selectedItem = item;
          item.setColor('blue');
          //this.options.onSelected(item);
          $rootScope.$emit('item:selected', item);
        };
        $scope.unselectItem = function(item){
          this.selectedItem = null;
          item.setColor('red');
          $rootScope.$emit('items:unselected');
        };

        var canvas = document.getElementById('plan');
        var stage = new fabric.Canvas(canvas, {
          hoverCursor: 'pointer'
        });
        stage.setBackgroundImage('images/main-bg.jpg', stage.renderAll.bind(stage));

        stage.on('object:selected', function(e){
          var item = e.target;
          item.setColor('blue');
          if($scope.selectedItem){
            $scope.unselectItem($scope.selectedItem);
          }
          $scope.selectItem(item);
        }).on('selection:cleared', function(){
          if($scope.selectedItem){
            $scope.unselectItem($scope.selectedItem);
            //this.options.onClear();
          }
        }).on('object:modified', function(e){
          var item = e.target;
          item.data.position = {top: item.top, left: item.left};
        });

        $scope.renderItems();

        $rootScope.$on('search', function(obj, str){
          
        });
      }
    }
   });
})();