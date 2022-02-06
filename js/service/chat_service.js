$(function () {
    var img_type = ["png", "jpg", "jpeg", "gif", "tiff"];
    layui.use("layer", function () {
        var layer = layui.layer;
    })
    var ws;

    // 判断是不是登录，如果没有登录，先去登录
    if ($.cookie("service_is_login") == 'false' || $.cookie("service_is_login") === undefined || $.cookie("service_user_type") != "service") {
        location.href = "/service/login.html";
    } else {
        // 建立ws连接
        ws = new WebSocket("ws://127.0.0.1:8000/data/wstest/");
    }


    // 建立成功的回调
    ws.onopen = function () {
        console.log("已建立连接");
    }
    // 收到消息的回调
    ws.onmessage = function (msg) {
        // console.log(msg.data);
        var data = JSON.parse(msg.data);  // 解析为json
        // console.log(data);
        var from_name = data.name;
        var from_id = data.id;
        var head = data.head;
        var time = data.time;
        time = time.split(" ")[1].slice(0, 8);
        // console.log(time);
        var content = data.content;
        var media_url = data.media_url;
        var type = data.type;

        if (type == "text") {  // 如果消息为文本
            var html_content_list = '<div class="msg_box layui-clear"><div class="recv">' +
                '<img src="' + app_root + media_url + head + '" alt="" class="user_head"><div class="content">' +
                xss_defender(content) + '</div></div></div>';
        } else if (type == "file") {  // 如果消息为文件
            var file_name = content.split("/upload_files/chat_file/")[1];
            var html_content_list = '<div class="msg_box layui-clear"><div class="recv">' +
                '<img src="' + app_root + media_url + head + '" alt="" class="user_head"><div class="content">' +
                '<a href="' + app_root + content + '" target="_blank">' + xss_defender(file_name) + '</a></div></div></div>';
        } else if (type == "image") {
            var file_name = content.split("/upload_files/chat_file/")[1];
            var html_content_list = '<div class="msg_box layui-clear"><div class="recv">' +
                '<img src="' + app_root + media_url + head + '" alt="" class="user_head"><div class="content">' +
                '<a href="' + app_root + content + '" target="_blank"><img src="' + app_root + content + '" target="_blank" alt="' + file_name + '" width="50" height="50" /></a></div></div></div>';
        }
        // 左侧用户列表
        var html_user_list = '<div class="user_li layui-clear" id="' + from_id + '"><img src="' + app_root + media_url + head + '" alt="">' +
            '<div class="user_name">' + from_name + '</div><div class="last_time">' + time + '</div><div class="pre_content">' + xss_defender(content.slice(0, 10)) + '</div></div>';

        if ($("#" + from_id).length > 0) {
            // 左侧用户列表有此用户
            if ($("#" + from_id).hasClass("this_user")) {  // 如果第一个是当前用户
                $("#" + from_id).remove();
                $("#user_list_box").prepend(html_user_list);  // 操作用户列表，收到后，用户列表置为第一个
                $("#chat" + from_id).append(html_content_list);  // 操作消息记录
                $("#chat" + from_id).children(":last").get(0).scrollIntoView(false);  // 自动滚至最下
                $("#" + from_id).addClass("this_user");  // 添加this_user类
            } else {
                $("#" + from_id).remove();
                $("#user_list_box").prepend(html_user_list);  // 操作用户列表
                $("#chat" + from_id).append(html_content_list);  // 操作消息记录
                $("#chat" + from_id).children(":last").get(0).scrollIntoView(false);  // 自动滚至最下
            }

        } else {
            // 左侧用户列表无此用户
            $("#user_list_box").prepend(html_user_list);  // 加入左侧用户列表
            $("#content_history").prepend("<div class=\"chat_person\" id=\"chat" + from_id + "\">" + html_content_list + "</div>")
        }
    }

    // 点击发送按钮
    $("#send_btn").click(function () {
        var content = $("#msg_input").val();
        if (content == "") {
            layer.msg("不能发送空白消息");
            return;
        }
        // 过滤转移字符
        var new_content = "";
        for (var i = 0; i < content.length; i++) {
            if (content[i] == "\n" || content[i] == "\r" || content[i] == "\b" || content[i] == "\v" || content[i] == "\t") {
                new_content += "<br>";
            } else {
                new_content += content[i];
            }
        }
        // 获取当前给谁发
        var repeat_user_id = $(".this_user").attr("id");
        if (repeat_user_id === undefined) {
            layer.msg("您要发送给谁呀？");
            return;
        }

        var oSendContent = {
            text: xss_defender(new_content),  // 内容
            to: repeat_user_id,  // 给客服发送
            time: moment().format('YYYY-MM-DD hh:mm:ss.SSS'),  // 时间戳
            type: "text",
        };
        ws.send(JSON.stringify(oSendContent));  // 发送
        $("#msg_input").val("");
        var html = '<div class="msg_box layui-clear"><div class="send">' +
            '<img src="/img/default-head.png" alt="" class="user_head"><div class="content">' +
            xss_defender(new_content) + '</div></div></div>';
        $("#chat" + repeat_user_id).append(html);
        $("#chat" + repeat_user_id).children(":last").get(0).scrollIntoView(false);
    })

    // 点击左侧用户列表，选择用户
    $("#user_list_box").on("click", ".user_li", function () {
        $("#chat" + $(this).attr("id")).addClass("chat_show").siblings().removeClass("chat_show");
        $(this).addClass("this_user").siblings().removeClass("this_user");
    })

    // 获取文件
    $("#get_file_btn").click(function () {
        $("#get_file").click();
    })

    // 发送文件
    $("#get_file").change(function () {
        var repeat_user_id = $(".this_user").attr("id");
        if (repeat_user_id === undefined) {
            layer.msg("您要发送给谁呀？");
            return;
        }
        var file = this.files[0];
        var file_split = file.name.split(".")
        var file_type = file_split[file_split.length - 1];
        console.log(file_type);
        if (img_type.indexOf(file_type) != -1) {
            var type = "image";
        }
        else {
            var type = "file"
        }
        var time = moment().format('YYYY-MM-DD hh:mm:ss.SSS');
        var formData = new FormData();  // 构造表单数据对象

        formData.append("chat_file", file);  // 添加表单数据
        formData.append("time", time);
        formData.append("to", repeat_user_id);
        formData.append("type", type);

        // ajax发送表单数据
        $.ajax({
            url: app_root + "/data/chat_file",
            type: "post",
            dataType: "json",
            data: formData,
            processData: false, // 告诉jQuery不要去处理发送的数据
            contentType: false, // 告诉jQuery不要去设置Content-Type请求头
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
                var file_name = msg.msg.file_name;
                var from_id = msg.msg.from_id;
                var from_name = msg.msg.from_name;
                var text = msg.msg.text;
                var time = msg.msg.time;
                var to = msg.msg.to;
                var new_content = "";
                for (var i = 0; i < file_name.length; i++) {
                    if (file_name[i] == "\n" || file_name[i] == "\r" || file_name[i] == "\b" || file_name[i] == "\v" || file_name[i] == "\t") {
                        console.log(file_name[i])
                        new_content += "<br>";
                    } else {
                        new_content += file_name[i];
                    }
                }
                if (type == "file") {
                    var html = '<div class="msg_box layui-clear"><div class="send">' +
                        '<img src="/img/default-head.png" alt="" class="user_head"><div class="content">' +
                        '<a href="' + app_root + text + '" target="_blank">' + new_content + '</a></div></div></div>';
                } else if (type == "image") {
                    var html = '<div class="msg_box layui-clear"><div class="send">' +
                        '<img src="/img/default-head.png" alt="" class="user_head"><div class="content">' +
                        '<a href="' + app_root + text + '" target="_blank"><img src="' + app_root + text + '" target="_blank" alt="' + new_content + '" width="50" height="50" /></a></div></div></div>';
                }
                $("#chat" + repeat_user_id).append(html);
                $("#chat" + repeat_user_id).children(":last").get(0).scrollIntoView(false);
            }
        }).fail(function (e) {
            console.log(e);
        })
    })

    // 用户登出
    $("#logout").click(function () {
        layer.confirm('真的要退出登录吗?', { icon: 3, title: '退出登录', btn: ["取消", "退出"] }, function (index) {
            console.log("1")
            layer.close(index);
            return false;
        }, function (index) {
            $.ajax({
                url: app_root + "/user/service_log",
                type: "get",
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
                    location.reload();
                    // layer.msg("已退出登录");
                }
            }).fail(function (e) {
                console.log(e);
            })
        })
    })

    $.ajax({
        url: app_root + "/data/get_chat_history",
        type: 'get',
        dataType: 'json',
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
            var data = msg.msg;
            var html_user_list = '';
            var html_content_list_all = "";
            for (var key in data) {
                // console.log(key, data[key]);

                var html_user_list = html_user_list + '<div class="user_li layui-clear" id="' + key + '"><img src="' + app_root + data[key].media_url + data[key].head + '" alt="">' +
                    '<div class="user_name">' + data[key].name + '</div><div class="last_time">' + data[key]["his"][0].time.split(" ")[1].slice(0, 8) + '</div><div class="pre_content">' + xss_defender(data[key]["his"][0].content.slice(0, 10)) + '</div></div>';

                var html_content_list = "";
                for (var i = data[key]["his"].length - 1; i >= 0; i--) {

                    var this_data = data[key]["his"][i];

                    if (this_data.content_type == "text") {  // 如果消息为文本
                        if (this_data.type == "recv") {
                            var html_content_list = html_content_list + '<div class="msg_box layui-clear"><div class="recv">' +
                                '<img src="' + app_root + data[key].media_url + data[key].head + '" alt="" class="user_head"><div class="content">' +
                                xss_defender(this_data.content) + '</div></div></div>';
                        } else if (this_data.type == "send") {
                            var html_content_list = html_content_list + '<div class="msg_box layui-clear"><div class="send">' +
                                '<img src="/img/default-head.png" alt="" class="user_head"><div class="content">' +
                                xss_defender(this_data.content) + '</div></div></div>';
                        }
                    }
                    else if (this_data.content_type == "file") {  // 如果消息为文件
                        var file_name = this_data.content.split("/upload_files/chat_file/")[1];
                        if (this_data.type == "recv") {
                            var html_content_list = html_content_list + '<div class="msg_box layui-clear"><div class="recv">' +
                                '<img src="' + app_root + data[key].media_url + data[key].head + '" alt="" class="user_head"><div class="content">' +
                                '<a href="' + app_root + this_data.content + '" target="_blank">' + file_name + '</a></div></div></div>';
                        } else if (this_data.type == "send") {
                            var html_content_list = html_content_list + '<div class="msg_box layui-clear"><div class="send">' +
                                '<img src="/img/default-head.png" alt="" class="user_head"><div class="content">' +
                                '<a href="' + app_root + this_data.content + '" target="_blank">' + file_name + '</a></div></div></div>';
                        }
                    }
                    else if (this_data.content_type == "image") {
                        var file_name = this_data.content.split("/upload_files/chat_file/")[1];
                        if (this_data.type == "recv") {
                            var html_content_list = html_content_list + '<div class="msg_box layui-clear"><div class="recv">' +
                                '<img src="' + app_root + data[key].media_url + data[key].head + '" alt="" class="user_head"><div class="content">' +
                                '<a href="' + app_root + this_data.content + '" target="_blank"><img src="' + app_root + this_data.content + '" target="_blank" alt="' + file_name + '" width="50" height="50" /></a></div></div></div>';
                        } else if (this_data.type == "send") {
                            var html_content_list = html_content_list + '<div class="msg_box layui-clear"><div class="send">' +
                                '<img src="/img/default-head.png" alt="" class="user_head"><div class="content">' +
                                '<a href="' + app_root + this_data.content + '" target="_blank"><img src="' + app_root + this_data.content + '" target="_blank" alt="' + file_name + '" width="50" height="50" /></a></div></div></div>';
                        }
                    }
                }
                html_content_list_all = html_content_list_all + "<div class=\"chat_person\" id=\"chat" + key + "\">" + html_content_list + "</div>"
            }
            $("#content_history").html(html_content_list_all)
            $("#user_list_box").html(html_user_list);
        }
    }).fail(function (e) {
        console.log(e);
    })

})
