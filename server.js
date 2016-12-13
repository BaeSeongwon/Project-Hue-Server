/**
 * Created by Life on 2016-12-13.
 */
var http = require('http');
var express = require('express');

var app = express();

http.createServer(app).listen('3000',function(){
    console.log("프로젝트 휴 서버 생성 성공 포트 3000!!");
});