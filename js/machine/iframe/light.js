$(function () {
    layui.use("layer", function () {
        const layer = layui.layer;
        var paramsStr = window.location.search
        var params = new URLSearchParams(paramsStr)
        var id = params.get('id') // list
        var type = params.get('type') // list
        if (!id || !type) {
            layer.msg("页面错误");
            return;
        } else {
            ;
        }
    })

    function get_data() {
        var paramsStr = window.location.search
        var params = new URLSearchParams(paramsStr)
        var id = params.get('id') // list
        var type = params.get('type') // list
        $.ajax({
            url: app_root + "/data/get_data",
            type: "get",
            dataType: "json",
            data: {
                id: id,
                type: type,
            },
            xhrFields: {
                withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
            },
            crossDomain: true,
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function (msg) {
            console.log(msg);
            if (msg.state == "ok") {
                var last_data = msg.msg[0];
                if (last_data['LED_state'] == "1") {
                    $("#light_status").text("已开启");
                    $("#light_btn").text("关灯");
                    $("#light_btn").addClass("layui-btn-normal");
                } else {
                    $("#light_status").text("未开启");
                    $("#light_btn").text("开灯");
                    $("#light_btn").removeClass("layui-btn-normal");
                }
                var data_history = "";
                // for(var i=msg.msg.length-1;i>=0;i--){  // 由前到后
                // for(var i=0; i<msg.msg.length-1; i++){
                //     data_history = data_history + "<li>"+JSON.stringify(msg.msg[i])+"</li>"
                // }
                // $("#data_history").html(data_history);
            }
        }).fail(function (e) {
            console.log(e);
            if(e.status==500){
                layer.msg("错误，请检查设备类型与id是否正确");
                clearInterval(timer1);
	        clearInterval(timer2);
	    }
	})
    }
    get_data();
    timer1 = setInterval(get_data, 5000);

    function get_command_history() {
        var paramsStr = window.location.search
        var params = new URLSearchParams(paramsStr)
        var id = params.get('id') // list
        var type = params.get('type') // list
        $.ajax({
            url: app_root + "/data/get_command_history",
            type: "get",
            dataType: "json",
            data: {
                id: id,
                type: type,
            },
            xhrFields: {
                withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
            },
            crossDomain: true,
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function (msg) {
            console.log(msg);
            if (msg.state == "ok") {
                var html = "";
                for (var i = 0; i < msg.msg.length; i++) {
                    if (msg.msg[i].command == "0") {
                        html = html + "<li class=\"cmd_off\"><span>关灯</span>&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;&nbsp;<span>" + msg.msg[i].time.slice(0, 19) + "</span></li>"
                    } else {
                        html = html + "<li class=\"cmd_on\"><span>开灯</span>&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;&nbsp;<span>" + msg.msg[i].time.slice(0, 19) + "</span></li>"
                    }
                }
                $("#data_history").html(html);
            }
        }).fail(function (e) {
            console.log(e);
        })
    }
    get_command_history();
    timer2 = setInterval(get_command_history, 5000);

    $("#light_btn").click(function () {
        var paramsStr = window.location.search
        var params = new URLSearchParams(paramsStr)
        var id = params.get('id') // list
        var type = params.get('type') // list
        var is_light_on = $(this).hasClass('layui-btn-normal');
        var command = is_light_on ? "0" : "1";
        $.ajax({
            url: app_root + "/data/mqtt_ctrl",
            type: "post",
            dataType: "json",
            data: {
                command: command,
                id: id,
                type: type,
            },
            xhrFields: {
                withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
            },
            crossDomain: true,
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function (msg) {
            // console.log(msg);
            if (msg.state == "ok") {
                // if (last_data['LED_state']=="1"){
                //     $("#light_status").text("已开启");
                //     $("#light_btn").text("关灯");
                //     $("#light_btn").addClass("layui-btn-normal");
                // }else{
                //     $("#light_status").text("未开启");
                //     $("#light_btn").text("开灯");
                //     $("#light_btn").removeClass("layui-btn-normal");
                // }
                layer.msg("ok");
            }
        }).fail(function (e) {
            console.log(e);
	    if(e.responseJSON.msg=="offline"){
	        layer.msg("设备不在线");
	    }
	})
    })


    $("#data_history_click").click(function(){
        $("#data_history").slideToggle(1000);
    })
})
