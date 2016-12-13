/**
 * Created by Life on 2016-12-13.
 */
var http = require('http');
var express = require('express');

var app = express();

app.get('/',function(req,res){
    res.send('<h1>아마존 AWS 서버</h1>');
});

http.createServer(app).listen('3000',function(){
    console.log("프로젝트 휴 서버 생성 성공 포트 3000!!");

});