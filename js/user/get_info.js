$(function () {
    layui.use(["element", "layer"], function () {
        var element = layui.element;
        var layer = layui.layer;
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
        else if (msg.state == "fail") {
            location.href = "/user/login.html";
        }
    }).fail(function (e) {
        console.log(e);
        if(e.responseJSON.msg=="ban"){
            layer.msg("拒绝，内含敏感词汇");
        }else if(e.status==403 &&e.responseJSON.msg=="jump to login"){
            layer.msg("请登录");
        }else{
            layer.msg(e.status);
        }
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
                // console.log(html);
                $("#history_content").html(html);
            }
        }).fail(function (e) {
            if(e.responseJSON.msg=="ban"){
                layer.msg("拒绝，内含敏感词汇");
            }else if(e.status==403 &&e.responseJSON.msg=="jump to login"){
                layer.msg("请登录");
            }else{
                layer.msg(e.status);
            }
        });
    }

    get_history(1);
    $("#history_switch").click(function () { get_history(1); })
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
                // console.log(html);
                $("#collection_content").html(html);

            }
        }).fail(function (e) {
            if(e.responseJSON.msg=="ban"){
                layer.msg("拒绝，内含敏感词汇");
            }else if(e.status==403 &&e.responseJSON.msg=="jump to login"){
                layer.msg("请登录");
            }else{
                layer.msg(e.status);
            }
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
                // console.log(html);
                $("#good_content").html(html);
            }
        }).fail(function (e) {
            if(e.responseJSON.msg=="ban"){
                layer.msg("拒绝，内含敏感词汇");
            }else if(e.status==403 &&e.responseJSON.msg=="jump to login"){
                layer.msg("请登录");
            }else{
                layer.msg(e.status);
            }
        });
    }
    get_good(1);

    $("#good_switch").click(function () { get_good(1) })
    // 获取点赞 end

    // 获取上传历史 start
    function get_upload(page) {
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
                type: "upload",
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
                        elem: 'nav_upload', //注意，这里的 test1 是 ID，不用加 # 号
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
                                get_upload(obj.curr);
                            }
                        },
                        layout: ['prev', 'page', 'next'],
                    });
                })
                var html = "";
                for (var i = 0; i < msg.msg.length; i++) {
                    html += '<div class="layui-col-md3 layui-col-sm3 layui-col-xs3 my_upload_item history_link">' +
                        '<a href="/org/essay.html?id=' + msg.msg[i].id + '">' + '<div class="layui-card layui-card-my">' +
                        '<div class="layui-card-header">' + xss_defender(msg.msg[i].title) + '</div>' +
                        '<div class="layui-card-body">' + xss_defender(msg.msg[i].content) + '</div></div></a>' +
                        '<input type="hidden" name="id" value="' + msg.msg[i].id + '">' +
                        '<div class="essay_delete_box" id="essay_delete_box"><i class="layui-icon layui-icon-delete"></i><span>删除</span></div></div>';
                }
                // console.log(html);
                $("#my_upload_essay").html(html);
            }
        }).fail(function (e) {
            if(e.responseJSON.msg=="ban"){
                layer.msg("拒绝，内含敏感词汇");
            }else if(e.status==403 &&e.responseJSON.msg=="jump to login"){
                layer.msg("请登录");
            }else{
                layer.msg(e.status);
            }
        });
    }
    get_upload(1);

    $("#my_upload").click(function () { get_upload(1) })
    // 获取上传历史 end

    $("#my_upload_essay").on("click", "#essay_delete_box", function(){
        var essay_id = $(this).prev().val();
        layer.confirm("删除这篇文章？", {icon:3,title:"删除",btn:['取消', "删除"]
        },
        function(index){
            console.log('1');
            layer.close(index);
            return false;
        },
        function(index){
            console.log("2")
            layer.msg("删除中");
            $.ajax({
                url: app_root + "/essay/detail",
                type:"delete",
                dataType:'json',
                xhrFields: {
                    withCredentials: true,
                },
                crossDomain: true,
                data: {
                    essay_id: essay_id
                },
                headers: {
                    "X-CSRFToken": get_csrf_token(),
                },
            }).done(function(msg){
                console.log(msg);
                if(msg.state=="ok"){
                    $("#my_upload").click();
                }
            }).fail(function(e){
                console.log(e);
                if(e.responseJSON.msg=="ban"){
                    layer.msg("拒绝，内含敏感词汇");
                }else if(e.status==403 &&e.responseJSON.msg=="jump to login"){
                    layer.msg("请登录");
                }else{
                    layer.msg(e.status);
                }
            })
        })
    })
})
