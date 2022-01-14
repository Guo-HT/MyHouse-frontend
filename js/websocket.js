$(function () {
    var ws;

    $("#start").click(function () {
        if ($("#userName").val() == "") {
            alert("请输入用户名");
            return;
        }
        if ("WebSocket" in window) {
            console.log("您的浏览器支持 WebSocket!");
        }

        ws = new WebSocket("ws://127.0.0.1:8000/data/wstest/");

        ws.onopen = function () {
            console.log("WS 连接已建立");
            var userName = $("#userName").val();
            var date = new Date();
            var msg = {
                text: "login",
                userName: userName,
                to: "*",
                time: date.getTime()
            };
            ws.send(JSON.stringify(msg));
            $("#running-tip").text("在线");
            $("#running").css({"background-color":"red"})
            timer_blink = setInterval(blink, 1000);

        }

        ws.onclose = function () {
            console.log("WS 连接已断开");
        }

        ws.onmessage = function (msg) {
            var msg_data = msg.data;
            var recv = JSON.parse(msg_data)
            var from = recv.userName;
            var data = recv.data;
            var time = recv.time;
            console.log(recv);
            if($("#"+from).length>0){
                console.log("已存在");
                $("#chat-"+from).html($("#chat-"+from).html()+"<span class=\"recv\">"+data+"</span>")
            }
            else{
                $("#list").html($("#list").html()+"<li id=\""+ from+"\">"+from+"</li>"); // 用户列表
                $("#content").html($("#content").html()+"<div class=\"content-chat other-view\" id=\"chat-"+from+"\"><span class=\"recv\">"+data+"</span></div>")
            }
        }

    })

    $("#end").click(function () {
        ws.close();
        clearInterval(timer_blink)
        $("#running").css({"background-color":"gray", "display":"inline-block"});
        $("#running-tip").text("下线");
        
    })

    $("#sendBtn").click(function () {
        var text = $("#textInput").val();
        var userName = $("#userName").val();
        var date = new Date()
        var from = $("#userName").val()=="superuser"?$(".cur-li").text():"superuser"
        var msg = {
            text: text,
            userName: userName,
            to: from,
            time: date.getTime()
        };
        ws.send(JSON.stringify(msg));

        if($("#"+from).length>0){
            console.log("已存在");
            $("#chat-"+from).html($("#chat-"+from).html()+"<span class=\"sendMsg\">"+text+"</span>")
        }
        else{
            $("#list").html($("#list").html()+"<li id=\""+ from+"\">"+from+"</li>"); // 用户列表
            $("#content").html($("#content").html()+"<div class=\"content-chat other-view\" id=\"chat-"+from+"\"><span class=\"sendMsg\">"+text+"</span></div>")
        }
    })

    $("#list").on("click", "li", function() {
        var cur_user = $(this).attr("id");
        $(this).addClass("cur-li").removeClass("other-li").siblings().addClass("other-li").removeClass("cur-li");
        console.log(cur_user);
        $("#chat-"+cur_user).removeClass("other-view").addClass("cur-view").siblings().removeClass("cur-view").addClass("other-view");

    })

    function blink(){
        $("#running").toggle();
    }
    

})
