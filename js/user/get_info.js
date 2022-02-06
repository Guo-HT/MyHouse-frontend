$(function () {
    layui.use("element", function () {
        var element = layui.element;
    });

    $.ajax({
        url: app_root + "/user/get_info",
        type: "get",
        dateType: "json",
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        },
        crossDomain: true,
        contentType: "application/json",
        headers: {
            "X-CSRFToken": get_csrf_token(),
        },
    }).done(function (msg) {
        console.log(msg);
        if (msg.state == "ok") {
            var img_url = app_root + msg.msg.media_url + msg.msg.photo;
            $("#user_head").attr("src", img_url);
            // $("#header_head_photo").attr("src", img_url);
            $("#user_name_detail").text(msg.msg.username);
            $("#user_id").text(msg.msg.id);
            $("#email_info").text(msg.msg.email);
            $("#reg_time").text(msg.msg.reg_time);
        }
        else if(msg.state=="fail"){
            location.href="/user/login.html";
        }
    }).fail(function (e) {
        console.log(e);
    })

    // 获取历史记录 start
    function get_history(page) {
        $.ajax({
            url: app_root + "/essay/get_per_info_list",
            type: "get",
            dataType: "json",
            xhrFields: {
                withCredentials: true,
            },
            crossDomain: true,
            data: {
                page: page,
                type: "history",
            },
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function (msg) {
            if (msg.state == "ok") {
                layui.use('laypage', function () {
                    const laypage = layui.laypage;
                    //执行一个laypage实例
                    laypage.render({
                        elem: 'nav_his', //注意，这里的 test1 是 ID，不用加 # 号
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
                                get_history(obj.curr);
                            }
                        },
                        layout: ['prev', 'page', 'next'],
                    });
                })

                var html = "";
                for (var i = 0; i < msg.msg.length; i++) {
                    html += '<a href="/org/essay.html?id=' + msg.msg[i].id + '" class="layui-col-md3 history_link">' +
                        '<div class="layui-card"><div class="layui-card-header">' + xss_defender(msg.msg[i].title) + '</div>' +
                        '<div class="layui-card-body">' + xss_defender(msg.msg[i].content) + '</div></div></a>';
                }
                console.log(html);
                $("#history_content").html(html);
            }
        }).fail(function (e) {

        });
    }

    get_history(1);
    $("#history_switch").click(function () { get_history(1);})
    // 获取历史记录 end

    // 获取收藏  start
    function get_collect(page) {

        $.ajax({
            url: app_root + "/essay/get_per_info_list",
            type: "get",
            dataType: "json",
            xhrFields: {
                withCredentials: true,
            },
            crossDomain: true,
            data: {
                page: page,
                type: "collections",
            },
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function (msg) {
            if (msg.state == "ok") {
                layui.use('laypage', function () {
                    const laypage = layui.laypage;
                    //执行一个laypage实例
                    laypage.render({
                        elem: 'nav_coll', //注意，这里的 test1 是 ID，不用加 # 号
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
                                get_collect(obj.curr);
                            }
                        },
                        layout: ['prev', 'page', 'next'],
                    });
                })
                var html = "";
                for (var i = 0; i < msg.msg.length; i++) {
                    html += '<a href="/org/essay.html?id=' + msg.msg[i].id + '" class="layui-col-md3 history_link">' +
                        '<div class="layui-card"><div class="layui-card-header">' + xss_defender(msg.msg[i].title) + '</div>' +
                        '<div class="layui-card-body">' + xss_defender(msg.msg[i].content) + '</div></div></a>';
                }
                console.log(html);
                $("#collection_content").html(html);

            }
        }).fail(function (e) {

        });
    }
    get_collect(1);
    $("#collection_switch").click(function () { get_collect(1) })
    // 获取收藏 end

    // 获取点赞 start
    function get_good(page) {
        $.ajax({
            url: app_root + "/essay/get_per_info_list",
            type: "get",
            dataType: "json",
            xhrFields: {
                withCredentials: true,
            },
            crossDomain: true,
            data: {
                page: page,
                type: "good",
            },
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function (msg) {
            if (msg.state == "ok") {
                layui.use('laypage', function () {
                    const laypage = layui.laypage;
                    //执行一个laypage实例
                    laypage.render({
                        elem: 'nav_good', //注意，这里的 test1 是 ID，不用加 # 号
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
                                get_good(obj.curr);
                            }
                        },
                        layout: ['prev', 'page', 'next'],
                    });
                })
                var html = "";
                for (var i = 0; i < msg.msg.length; i++) {
                    html += '<a href="/org/essay.html?id=' + msg.msg[i].id + '" class="layui-col-md3 history_link">' +
                        '<div class="layui-card"><div class="layui-card-header">' + xss_defender(msg.msg[i].title) + '</div>' +
                        '<div class="layui-card-body">' + xss_defender(msg.msg[i].content) + '</div></div></a>';
                }
                console.log(html);
                $("#good_content").html(html);
            }
        }).fail(function (e) {

        });
    }
    get_good(1);

    $("#good_switch").click(function () {get_good(1) })
    // 获取点赞 end
})
