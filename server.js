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


app.use(express.static(__dirname));


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



//TODO:WEMO 검색
app.get('/search' ,function (req,res) {

    console.log("왔음");

    request({

        // url: 'http://192.168.0.23:3000/searchwemo',
        url: 'http://cutesubini.iptime.org:70/searchwemo',
        method: 'get'
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {

           var friendlyName = body[0].friendlyName;
            var serialNumber= body[0].serialNumber;
            var id="subin";

            res.end("끝");
        }
    });

});

//TODO:WEMO 제어(완료)
app.post('/wemocontrol' ,function (req,res) {




// console.log(req.body);
    var a=req.body.state;
    var instantPower=req.body.instantPower;
    var ONSince=req.body.ONSince;
    var OnFor = req.body.OnFor;
    var TodayONTime = req.body.TodayONTime;
    var TodayConsumed=req.body.TodayConsumed;
    console.log(a);
    console.log(instantPower);
    console.log(ONSince);
    console.log(OnFor);
    console.log(TodayONTime);
    console.log(TodayConsumed);

           pool.getConnection(function (err,connection) {
        
            var sql ="select Id from wemo where Id=?";

            connection.query(sql,req.session.user_id,function (err,data) {
        
                if(data==""){
                    var data =[req.session.user_id,a,ONSince,OnFor,TodayONTime,TodayConsumed,instantPower];
                    var sql2 = "insert into wemo(Id,state,OnSince,OnFor,TodayONTime,TodayConsumed,instantPower) values(?)";
        
                    connection.query(sql2,[data],function (err, data) {
        
                        if (err) console.error("err : " + err);
                        console.log(data);
                        res.send("삽입 완료!");
                        connection.release();
                    });
                }
        
                else {
                    console.log("씨바ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ");
                    var sql3="update wemo set state=?,OnSince=?,OnFor=?,TodayONTime=?,TodayConsumed=?,instantPower=? where Id=?";
                    connection.query(sql3,[a,ONSince,OnFor,TodayONTime,TodayConsumed,instantPower,req.session.user_id],function (err,suc) {
        
                        if (err) console.error("err : " + err);
                        console.log(data);
                        res.send("삽입 완료!");
                        connection.release();
                    })
                }
            });

        });

});


/* GET home page. */
app.get('/', function(req, res, next) {
    res.end("aaaaaa");
});


app.post('/huecontrolOff',function (req,res,next) {
    console.log("hue off 들어옴");
    console.log(req.body);
    var state = req.body.state;
    var color= req.body.color;
    var bright=req.body.bright;

    console.log(state);
    console.log(color);
    console.log(bright);
    pool.getConnection(function (err, connection) {

        var sql = "select Id from hue where Id=?";
        connection.query(sql, req.session.user_id, function (err, data) {

            if (data == "") {
                var data = [req.session.user_id, state, color, bright];
                var sql2 = "insert into hue(Id,state,color,bright) values(?)";

                connection.query(sql2, [data], function (err, data) {

                    if (err) console.error("err : " + err);
                    console.log(data);
                    res.send("삽입 완료!");
                    connection.release();
                });
            }

            else {

                var sql3 = "update hue set state=?,color=?,bright=? where Id=?";
                connection.query(sql3, [state, color, bright, req.session.user_id], function (err, suc) {

                    if (err) console.error("err : " + err);
                    console.log(data);
                    res.send("삽입 완료!");
                    connection.release();
                })
            }
        });


    });
});



app.post('/huecontrolOn',function (req,res,next) {

    console.log("hue on 들어옴");
    console.log(req.body);
var state = req.body.state;
    var color= req.body.color;
    var bright=req.body.bright;

    console.log(state);
    console.log(color);
    console.log(bright);
    pool.getConnection(function (err, connection) {

        var sql = "select Id from hue where Id=?";
        connection.query(sql, req.session.user_id, function (err, data) {

            if (data == "") {
                var data = [req.session.user_id, state, color, bright];
                var sql2 = "insert into hue(Id,state,color,bright) values(?)";

                connection.query(sql2, [data], function (err, data) {

                    if (err) console.error("err : " + err);
                    console.log(data);
                    res.send("삽입 완료!");
                    connection.release();
                });
            }

            else {

                var sql3 = "update hue set state=?,color=?,bright=? where Id=?";
                connection.query(sql3, [state, color, bright, req.session.user_id], function (err, suc) {

                    if (err) console.error("err : " + err);
                    console.log(data);
                    res.send("삽입 완료!");
                    connection.release();
                })
            }
        });


    });
});





//TODO:HUE 기기정보
app.get('/searchhue',function (req,res,next) {

    request({
        // url: 'http://192.168.0.23:3000/searchhue',
        url: 'http://cutesubini.iptime.org:70/searchhue',
        method: 'get'
    }, function(error, response, body){
        console.log(body);
        res.end("ㅎㅇ");
    });

});

//TODO:회원가입
app.post('/Join' ,function (req,res,next) {

    console.log("왓다데이터!!!!!!!!!!!!!!");
    
    var id =req.body.id;
    var password= req.body.password;
    var cpe_key=req.body.cpe_key;
    var ip="192.168.0.26";
    
    pool.getConnection(function (err,connection) {

        var data =[id,password,cpe_key,ip];
       var sql = "insert into user(Id,password,cpe,ip) values(?)";

        connection.query(sql,[data],function (err, data) {

            if (err) console.error("err : " + err);
            console.log(data);
            res.send("회원가입 완료!");
            connection.release();
        });
    });
    
});


//TODO:로그인
app.post('/Login',function (req,res) {
    
    console.log("로그인 들어옴");
    var user = {
        id:req.body.id,
        password:req.body.password
    };
    // var user = {
    //     id:"shanik21",
    //     password:"tosorl13"
    // };

    pool.getConnection(function (err,connection) {

        var sql = "select Id,password,cpe from user where Id=?";

        connection.query(sql,[user.id],function (err,data) {

            for(key in data){

                console.log(data);
                var db= {
                    key_id:data[key].Id,
                    key_password:data[key].password,
                    key_cpe_key:data[key].cpe
                }
            }
            if(data=="")
            {
                console.log("10000");
                res.send("아이디가 존재하지 않습니다.");
            }

            else if(user.password===db.key_password&&user.id===db.key_id)
            {
                console.log("20000");
                req.session.user_id = user.id;
                req.session.user_cpe=db.key_cpe_key;

                console.log(req.session.user_id);
                console.log(req.session.user_cpe);

                res.cookie('id',req.session.user_id);
                res.cookie('cpe',req.session.user_cpe);
                res.send("로그인 완료");

            }
            else if (user.password===db.key_password||user.id===db.key_id)
            {
                console.log("30000");
                res.send("다시한번 확인 해주세요.");
            }
        });
    });
});

app.get('/Logout',function (req,res,next) {
    req.session.destroy();
    res.clearCookie('id');
    res.clearCookie('cpe');
    res.end("Logout");
});




app.get('/getWemoData',function (req,res) {

    pool.getConnection(function (err,connection) {

        var sql = "select state,OnSince,OnFor,TodayONTime,TodayConsumed,instantPower from wemo where Id=?";

        connection.query(sql,[req.session.user_id],function (err, data) {

            if (err) console.error("err : " + err);
            console.log(data);
            res.send(data);
            connection.release();
        });
    });

});

