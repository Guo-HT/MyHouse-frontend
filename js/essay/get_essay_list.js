$(function () {

    var paramsStr = window.location.search
    var params = new URLSearchParams(paramsStr)
    var page = params.get('p'); // list
    if (!page) {
        page = 1;
    }
    var search_str = params.get("search");
    if (search_str){
        $("#search_str").text(search_str + "  的搜索结果：")
    }
    
    $.ajax({
        url: app_root + "/essay/details",
        type: "get",
        dataType: "json",
        data: {
            list_for: "details",
            search: search_str,
            page: page,
        },
    }).done(function (msg) {
        // console.log(msg.page_num);
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'page_nav', //注意，这里的 test1 是 ID，不用加 # 号
                count: msg.total_count, //数据总数，从服务端得到
                limit: msg.per_page,  //
                curr: page,
                jump: function (obj, first) {
                    //obj包含了当前分页的所有参数，比如：
                    // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    // console.log(obj.limit); //得到每页显示的条数
                    //首次不执行
                    if (!first) {
                        //do something
                        location.href = "/org/index.html?p="+obj.curr;
                    }
                },
                layout:['prev', 'page', 'next', 'count'],
            });
        });
        var html = "";
        if (msg.state == "ok") {
            for (var i = 0; i < msg.msg.length; i++) {
                html += "<li class=\"list_body_li layui-clear\"><a href=\"/org/essay.html?id=" + msg.msg[i].id + "\" target=\"_blank\">" +
                    "<div class=\"layui-col-md3 layui-col-xs3 title\">" + msg.msg[i].title + "</div>" +
                    "<div class=\"layui-col-md4 layui-col-xs3 content\">" + msg.msg[i].content + "</div>" +
                    "<div class=\"layui-col-md2 layui-col-xs2 writer\">" + msg.msg[i].user + "</div>" +
                    "<div class=\"layui-col-md2 layui-col-xs2 datetime\">" + msg.msg[i].create_time + "</div>" +
                    "<div class=\"layui-col-md1 layui-col-xs2 watched\">" + msg.msg[i].watch_num + "</div>" +
                    "</a></li>"
            }
        } else {
            html = "<li class=\"list_body_li layui-clear error\">出现错误...</li>";
        }
        $("#list_body_ul").html(html);
    }).fail(function (e) {
        console.log(e);
    })


})

