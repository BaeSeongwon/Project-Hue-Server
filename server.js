/**
 * Created by Parksubin on 2016-12-15.
 */
var http = require('http');
var path = require('path');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var cookie = require('cookie-parser');
var session = require('express-session');
var url =require('url');
var request = require('request');
var app = express();

//TODO:미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookie());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret :'subin',
    resave :false,
    saveUninitialized: true
}));

//TODO:Server구동
http.createServer(app).listen('80',function(){
    console.log('서버실행했다장보리!!');
});

//TODO:DB Connection
var pool = mysql.createPool({
    connectionLimit: 15,
    host: 'hue.c4yiq5vuopvi.ap-northeast-2.rds.amazonaws.com',
    user: 'root',
    database:'HueDB',
    password: 'seongwon9179'
});

app.use(express.static(__dirname));



/* GET home page. */
app.get('/', function(req, res, next) {
    res.end("aaaaaa");
});


app.get('/wemoControl',function (req,res,next) {

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
app.get('/Login',function (req,res) {
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

                res.send("로그인 완료.");

            }

            else if (user.password===db.key_password||user.id===db.key_id)
            {

                res.send("다시한번 확인 해주세요.");

            }
        });
    });
});

