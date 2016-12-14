var express = require('express');
var request = require('request');
var mysql = require('mysql');
var session = require('express-session');
var router = express.Router();

var pool = mysql.createPool({
  connectionLimit: 15,
  host: 'hue.c4yiq5vuopvi.ap-northeast-2.rds.amazonaws.com',
  user: 'root',
  database:'HueDB',
  password: 'seongwon9179'
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.end("aaaaaa");
});


router.get('/wemoControl',function (req,res,next) {

  // var state = req.body.state;

  var a = {
    "name":"Developer Bridge"
  }
  var options = {
    // url: 'http://192.168.0.19/api/XIZOy152etSXOyNpcKuOw-xcwkkRRCoCIkaBUk-z/lights/3/state',
    url: 'http://192.168.0.26:8000/test',
    method:"get",
    body:JSON.stringify(a)

  };
  function subin(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      console.log(info);
    }
  }
  request(options,subin);

});


//TODO:로그인
router.get('/Login',function (req,res) {
  var user = {
    id: 'root',
    password: '1234'
  };
  
  pool.getConnections(function (err,connection) {
    
    var sql = "select Id from user where Id=?";
    
    connection.query(sql,[user.id],function (err,data) {
      
      for(key in data){
        
        var db= {
          key_id:data[key].Id,
          key_password:data[key].password
        }
      }
      if(result=="")
      {
        res.send("아이디가 존재하지 않습니다.");
      }

      else if(user.password===db.key_password&&user.id===db.key_id)
      {

        req.session.user_id = user.id;
        console.log('로그인 완료');
        res.send("로그인 완료.");

      }

      else if (user.password===db.key_password||user.id===db.key_id)
      {

        res.send("다시한번 확인 해주세요.");

      }
    });
  });
});

