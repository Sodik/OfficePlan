app.controller('appCtrl', function($scope, $timeout, mediator){
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
  $scope.counter = $scope.people.length;
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
    $scope.selectedItem = data;
  });
});