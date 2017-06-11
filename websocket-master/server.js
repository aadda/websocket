var express = require("express");
var app = express();
app.use("/", express.static(__dirname + "/www"));
var http = require("http");
var server = http.createServer(app);
server.listen(3000);
var socketIo = require("socket.io");
var users = [];
var io = socketIo.listen(server); //将socket.io模块绑定到服务器

io.on("connection", function(socket) {
    socket.on("login", function(data) {
        if (users.indexOf(data) > -1) { //用户名已存在
            socket.emit("existed");
        } else {
            users.push(data);
            socket.user = data;
            socket.emit("loginSuccess");
            io.sockets.emit("system", users);
        }
    });
    socket.on("send", function(data) {
        io.sockets.emit("showMes", data, socket.user);
    });
    socket.on("disconnect", function() { //socket.io自带disconnect事件 当用户端开连接时处发
        console.log("quit");
        deleteVal(users, socket.user);
        io.sockets.emit("system", users);
    });
});

//编写函数,删除数组中指定元素
function deleteVal(arr, val) {
    var i = 0;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            break;
        }
    }
    if (i < arr.length) {
        arr.splice(i, 1);
    }
    return arr;
}