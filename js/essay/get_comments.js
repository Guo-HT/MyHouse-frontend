$(function () {
    layui.use("layer", function () {
        var layer = layui.layer;
    })


    var paramsStr = window.location.search
    var params = new URLSearchParams(paramsStr)
    var id = params.get('id')

    // 获取评论及回复 start
    function get_all_comment(page){
        $.ajax({
            url: app_root + "/essay/comment",
            type: "get",
            dataType: "json",
            data: {
                for: id,
                page:page,
            }
        }).done(function (msg) {
            // console.log(msg);
            var html = "";
            if (msg.state == "ok") {
    
                layui.use('laypage', function () {
                    var laypage = layui.laypage;
                    //执行一个laypage实例
                    laypage.render({
                        elem: 'comment_nav', //注意，这里的 test1 是 ID，不用加 # 号
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
                                get_all_comment(obj.curr);
                            }
                        },
                        layout: ['prev', 'page', 'next', 'count'],
                    });
                });
                // console.log(msg);
                for (var i = 0; i < msg.msg.length; i++) {
                    html += '<li class="root"><div class="line1"><span class="head_span"><img src="' + app_root + msg.msg[i].upload_file + msg.msg[i].head_path + '" alt=""></span>' +
                        '<span class="username_span">' + msg.msg[i].user_name + '</span><span class="comment_time">' + msg.msg[i].time + '</span></div>' +
                        '<div class="line2"><div class="comment_content">' + msg.msg[i].comment + '</div></div>' +
                        '<div class="line3"><i class="layui-icon layui-icon-heart-fill comment_good_icon"></i>' +
                        '<span class="comment_good_num">' + msg.msg[i].good_num + '</span><span class="comment_reply_switch">回复</span></div>' +
                        '<div class="line4"><div class="layui-row"><div class="layui-col-md11 layui-col-xs10">' +
                        '<input type="text" id="comment_reply" class="comment_reply" placeholder="回复"></div>' +
                        '<div class="layui-col-md1 layui-col-xs2"><button class="comment_reply_btn" id="comment_reply_btn">发布</button>' +
                        '</div></div></div></li>';
                    for (var j = 0; j < msg.msg[i].reply.length; j++) {
    
                        html += '<li class="child"><div class="line1"><span class="head_span"><img src="' + app_root + msg.msg[i].upload_file + msg.msg[i].reply[j].head_path + '" alt=""></span>' +
                            '<span class="username_span">' + msg.msg[i].reply[j].user_name + '</span><span style="color:#AEAEAE;"> 回复 </span><span>' + msg.msg[i].reply[j].reply_to + '</span><span class="comment_time">' + msg.msg[i].reply[j].time + '</span></div>' +
                            '<div class="line2"><div class="comment_content">' + msg.msg[i].reply[j].comment + '</div></div>' +
                            '<div class="line3"><i class="layui-icon layui-icon-heart-fill comment_good_icon"></i>' +
                            '<span class="comment_good_num">' + msg.msg[i].reply[j].good_num + '</span><span class="comment_reply_switch">回复</span></div>' +
                            '<div class="line4"><div class="layui-row"><div class="layui-col-md11 layui-col-xs10">' +
                            '<input type="text" id="comment_reply" class="comment_reply" placeholder="回复"></div>' +
                            '<div class="layui-col-md1 layui-col-xs2"><button class="comment_reply_btn" id="comment_reply_btn">发布</button></div></div></div></li>';
                    }
                }
                // console.log(html);
                $("#comment_list").html(html);
    
            }
        })
    } 
    get_all_comment(1);
    // 获取评论及回复 end

    // 发表评论 start
    $("#submit_comment").click(function () {
        var comment_content = $("#input_comment").val();
        if (comment_content == "") {
            layer.msg("请填写评论");
            return;
        }
        $.ajax({
            url: app_root + "/essay/comment",
            type: "post",
            dataType: "json",
            data: {
                content: comment_content,
                for: id,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
        }).done(function (msg) {
            console.log(msg);
            if (msg.state == "ok") {
                $("#input_comment").val("");
                // 回显
                var html = '<li class="root"><div class="line1"><span class="head_span"><img src="' + app_root + msg.msg.upload_file + msg.msg.head_path + '" alt=""></span>' +
                    '<span class="username_span">' + msg.msg.user_name + '</span><span class="comment_time">' + msg.msg.time + '</span></div>' +
                    '<div class="line2"><div class="comment_content">' + msg.msg.comment + '</div></div>' +
                    '<div class="line3"><i class="layui-icon layui-icon-heart-fill comment_good_icon"></i>' +
                    '<span class="comment_good_num">' + msg.msg.good_num + '</span>' +
                    '<span class="comment_reply_switch">回复</span></div>' +
                    '<div class="line4"><div class="layui-row"><div class="layui-col-md11 layui-col-xs10">' +
                    '<input type="text" id="comment_reply" class="comment_reply" placeholder="回复"></div>' +
                    '<div class="layui-col-md1 layui-col-xs2"><button class="comment_reply_btn" id="comment_reply_btn">发布</button>' +
                    '</div></div></div></li>';
                $("#comment_list").html(html + $("#comment_list").html());
            }
        }).fail(function (e) {
            console.log(e);
        })
    });
    // 发表评论 end

    // 点击回复 start
    $("#comment_list").on("click", ".comment_reply_switch", function () {
        if ($(this).text() == "回复") {
            $(this).text("收起回复");
        }
        else if ($(this).text() == "收起回复") {
            $(this).text("回复");
        }
        $(this).parent().parent().find(".line4").toggle();
    })
    // 点击回复 end


    // 发表回复 start
    $("#comment_list").on("click", "#comment_reply_btn", function () {
        var is_login = $.cookie('is_login');
        if (!is_login) {
            layer.msg("请登录");
            return;
        }
        var reply_content = $(this).parent().parent().find(".comment_reply").val();
        if (reply_content == "") {
            layer.msg("请填写评论");
            return;
        }
        var reply_to_user = $(this).parent().parent().parent().parent().find(".username_span").text();
        var reply_to_time = $(this).parent().parent().parent().parent().find(".comment_time").text();
        var root = $(this).parent().parent().parent().parent();
        if (root.attr("class") != "root") {
            while (root.attr("class") != "root") {
                root = root.prev();
            }
        }
        var root_content = root.find(".comment_content").text();  // root的内容
        var root_time = root.find(".comment_time").text();  // root的时间
        var root_user = root.find(".username_span").text()

        console.log(reply_to_user);
        $.ajax({
            url: app_root + "/essay/reply",
            type: "post",
            dataType: "json",
            data: {
                reply_content: reply_content,  // 回复的内容，自己输入的
                reply_to_user: reply_to_user,  // 回复谁，点击的这个
                reply_to_time: reply_to_time,  // 回复的时间，点击的这个
                root_content: root_content,  // 当前属于的root
                root_time: root_time,  // root的时间
                root_user: root_user,  // root的用户名
                essay_id: id,
            },
            xhrFields: {
                withCredentials: true,
            },
            crossDomain: true,
        }).done(function (msg) {
            console.log(msg);
            html = '<li class="child"><div class="line1"><span class="head_span"><img src="' + app_root + msg.msg.upload_file + msg.msg.head_path + '" alt=""></span>' +
                '<span class="username_span">' + msg.msg.user_name + '</span><span style="color:#AEAEAE;"> 回复 </span><span>' + msg.msg.reply_to + '</span><span class="comment_time">' + msg.msg.time + '</span></div>' +
                '<div class="line2"><div class="comment_content">' + msg.msg.comment + '</div></div><div class="line3"><i class="layui-icon layui-icon-heart-fill comment_good_icon"></i>' +
                '<span class="comment_good_num">' + msg.msg.good_num + '</span><span class="comment_reply_switch">回复</span></div><div class="line4"><div class="layui-row"><div class="layui-col-md11 layui-col-xs10">' +
                '<input type="text" id="comment_reply" class="comment_reply" placeholder="回复"></div>' +
                '<div class="layui-col-md1 layui-col-xs2"><button class="comment_reply_btn" id="comment_reply_btn">发布</button></div></div></div></li>'
            // $(this).parent().parent().parent().parent().after(html);
            $(this).parent().parent().find(".comment_reply").val("");
            $("#comment_list").html($("#comment_list").html()+html);
        }).fail(function (e) {
            console.log(e);
        })

    })
    // 发表回复 end


    // 评论、回复点赞 start
    $("#comment_list").on("click", ".comment_good_icon", function(){
        var comment_type = $(this).parent().parent().attr("class");
        var comment_time = $(this).parent().parent().find(".comment_time").text();
        var comment_user = $(this).parent().parent().find(".username_span").text();
        var comment_content = $(this).parent().parent().find(".comment_content").text();
        var good_num_obj = $(this).parent().parent().find(".comment_good_num");
        console.log(comment_type, comment_time, comment_user);
        $.ajax({
            url:app_root+"/essay/c_r_good",
            type:'post',
            dataType:"json",
            data:{
                comment_type:comment_type,
                comment_time:comment_time,
                comment_user:comment_user,
                comment_content:comment_content,
            },
            xhrFields:{
                withCredentials:true,
            },
            crossDomain:true,
        }).done(function(msg){
            console.log(msg);
            if(msg.state=="ok"){
                good_num_obj.text(msg.msg.good_num);
            }
        }).fail(function(e){
            console.log(e);
        })

    })
    // 评论、回复点赞 end

})
