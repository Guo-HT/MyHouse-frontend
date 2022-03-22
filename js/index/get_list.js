$(function () {
    $.ajax({
        url: app_root + "/essay/details",
        type: "get",
        dataType: "json",
        data: {
            list_for: "index",
        },
        headers: {
            "X-CSRFToken": get_csrf_token(),
        },
    }).done(function (msg) {
        if (msg.state == "ok") {
            var html = "";
            for (var i = 0; i < msg.msg.length; i++) {
                // console.log(msg.msg[i]);
                html += "<li class=\"org_li\"><a href=\"/org/essay.html?id=" + msg.msg[i].id + "\" target=\"_blank\"><span class=\"org_li_title\">" + msg.msg[i].title + "</span>" +
                    "<span class=\"org_li_content\">" + xss_defender(msg.msg[i].content) + "</span>" +
                    "<span class=\"layui-badge org_list_badge\">" + msg.msg[i].watch_num + "</span></a></li>";
            }
            $("#org_ul").html(html);
        } else {
            $("#org_ul").html("<li class=\"org_li\">请求错误...请稍后重试</li>");
        }
    }).fail(function (e) {
        console.log(e);
        $("#org_ul").html("<li class=\"org_li\">发生错误</li>");
    })

    function get_machines_data() {
        if ($.cookie("is_login") == "false") {
            $("#data_ul").html("<li>请<a href='/user/login.html' style='color:blue;'>登录</a>后查看</li>");
            return;
        }
        $.ajax({
            url: app_root + "/data/get_machines_data",
            type: "get",
            dataType: "json",
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
                var html = "";
                if (msg.msg.length==0) {
                    html="<li>您还没有绑定设备哦，绑定以后再来查看你的房间数据吧！</li>"
                }
                else {
                    for (var i = 0; i < msg.msg.length; i++) {
                        if (msg.msg[i].work_type == "1") {
                            // console.log(html)
                            html = html + '<li class="data_li"><div>' +
                                '<img src="/img/' + WORK_TYPE[msg.msg[i].work_type] + '.jpg" alt="图片">' +
                                '<span class="label">' + xss_defender(msg.msg[i].name) + '</span>:&nbsp;&nbsp;' +
                                '<span class="data">' + (msg.msg[i].last_data.LED_state == 0 ? "关闭" : "打开") + '</span>&nbsp;&nbsp;' +
                                '<span class="time">' + msg.msg[i].last_data.time + '</span></div></li>'
                        }
                        else if (msg.msg[i].work_type == "2") {
                            // console.log(html)
                            html = html + '<li class="data_li"><div>' +
                                '<img src="/img/' + WORK_TYPE[msg.msg[i].work_type] + '.jpg" alt="图片">' +
                                '<span class="label">' + xss_defender(msg.msg[i].name) + '</span>:&nbsp;&nbsp;' +
                                '<span class="data">' + msg.msg[i].last_data.temp + '</span>℃&nbsp;&nbsp;' +
                                '<span class="data">' + msg.msg[i].last_data.humidity + '</span>%&nbsp;&nbsp;' +
                                '<span class="time">' + msg.msg[i].last_data.time + '</span></div></li>'
                        }
                    }
                }
                $("#data_ul").html(html);
            }
        }).fail(function (e) {
            console.log(e);
            if(e.responseJSON.msg="jump to login"){
                $("#data_ul").html("<li>请<a href='/user/login.html' style='color:blue;'>登录</a>后查看</li>");
            }
        })
    }
    get_machines_data();
})
