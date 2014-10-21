var fs = require('fs');
var mongo = require('mongodb');
var qs = require('querystring');
var Q = require('q');
var dataObject = {
  currentDb: null,
  connect: function(){
    var defer = Q.defer();
    mongo.MongoClient.connect('mongodb://localhost:27017/plan', function(err, db){
      if(err){
        defer.reject(err);
        return console.log(err);
      }
      this.currentDb = db;
      defer.resolve(db);
    }.bind(this));
    return defer.promise;
  },
  getCollection: function(collectionName){
    return this.currentDb.collection(collectionName);
  },
  close: function(){
    if(this.currentDb){
      this.currentDb.close();
    }
  }
}

module.exports = {
  home: function(res){
    res.writeHeader(200, {'Content-Type': 'text/html'});
    fs.readFile('index.html', 'utf-8', function(err, content){
      if(err){
        return console.log(err);
      }
      res.end(content, 'utf-8');
    });
    console.log('Start')
  },
  data: function(res){
    dataObject.connect().then(function(db){
      var collection = db.collection('plan');
      /*collection.insert([
        {
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
  }
      ], function(){

      });*/
      res.writeHeader(200, {'Content-Type': 'application/json'});
      collection.find({}).toArray(function(err, arr){
        console.log(arr);
        res.end( JSON.stringify(arr) );
        db.close
      });
    });
  },
  create: function(res, req){
    res.writeHeader(200, {'Content-Type': 'application/json'});
    var body;
    req.on('data', function(data){
      body = data;
    })
    req.on('end', function(){
       dataObject.connect().then(function(db){
        var collection = db.collection('people');
        console.log(qs.parse(body))
        collection.insert( qs.parse(body), function(err, item){
          if(err){
            return console.log(err);
          }
          console.log(item[0], 222)
          res.end(JSON.stringify(item[0]));
        });
      });
    });
  }
}