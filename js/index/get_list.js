$(function () {

    $.ajax({
        url: app_root + "/essay/details",
        type: "get",
        dataType: "json",
        data: {
            list_for: "index",
        }
    }).done(function (msg) {
        if (msg.state == "ok") {
            var html = "";
            for (var i = 0; i < msg.msg.length; i++) {
                // console.log(msg.msg[i]);
                html += "<li class=\"org_li\"><a href=\"/org/essay.html?id=" + msg.msg[i].id + "\" target=\"_blank\"><span class=\"org_li_title\">" + msg.msg[i].title + "</span>" +
                    "<span class=\"org_li_content\">" + msg.msg[i].content + "</span>" +
                    "<span class=\"layui-badge org_list_badge\">" + msg.msg[i].watch_num + "</span></a></li>";
            }
            $("#org_ul").html(html);
        }else{
            $("#org_ul").html("<li class=\"org_li\">请求错误...请稍后重试</li>");
        }
    }).fail(function (e) {
        console.log(e);
        $("#org_ul").html("<li class=\"org_li\">发生错误</li>");
    })





})
