$(function () {
    // 未登录：登录、注册
    // 已登录：个人信息（修改）、登出
    layui.use("layer", function () {
        var layer = layui.layer;
    })

    $.ajax({
        url: app_root + "/user/user_status",
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        },
        crossDomain: true,
        contentType: "application/json",
        headers: {
            "X-CSRFToken": get_csrf_token(),
        },
    }).done(function (msg) {
        // console.log(msg);
        // {is_login: false, user_id: null, user_name: null}
        // {"is_login": true, "user_id": 3, "user_name": "guoht", "media_url": "/upload_files/", "head_photo": "head_photo/20220107163652938174.png"}
        setHeader(msg);

    }).fail(function (e) {
        console.log(e);
    })

    // 页头按钮功能
    function setHeader(msg) {
        if (msg.is_login) {  // 登录状态
            // $("#nav-right li:eq(0) a").attr({"href":"/org/history.html"})
            $("#nav-right li:eq(0) a").attr({ "href": "/org/upload.html" })
            $("#nav-right li:eq(1) a").attr({ "title": msg.user_name, "href": "/user/info.html?id=" + msg.user_id, "target": "_blank" });
            $("#nav-right li:eq(1) a img").attr({ "src": app_root + msg.media_url + msg.head_photo })
            $("#nav-right li:eq(2) a").attr({ "href": "javascript:void(0)", "id": "logout" }).text("退出登录");
            $("#nav-right li:eq(3) a").attr({ "href": "javascript:void(0)", "id": "logoff" }).text("注销");
        }
        else {  // 游客状态
            $("#user-self").attr({ "title": "未登录" });
            $("#user-self img").attr({ "src": "/img/default-head.png" })
            $("#nav-right li:eq(0) a").attr({ "href": "/user/login.html" })
            $("#nav-right li:eq(1) a").attr({ "href": "/user/login.html" })
            $("#nav-right li:eq(2) a").removeAttr("id").attr({ "href": "/user/login.html", "target": "_self" }).text("登录");
            $("#nav-right li:eq(3) a").removeAttr("id").attr({ "href": "/user/register.html", "target": "_self" }).text("注册");
        }
    }

    // 用户登出
    $("#myhead").on("click", "#logout", function () {
        layer.confirm('真的要退出登录吗?', { icon: 3, title: '退出登录', btn: ["取消", "退出"] }, function (index) {
            console.log("1")
            layer.close(index);
            return false;
        }, function (index) {
            $.ajax({
                url: app_root + "/user/log",
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
                if(e.responseJSON.msg=="ban"){
                    layer.msg("拒绝，内含敏感词汇");
                }else{
                    layer.msg(e.status);
                }
            })
        })
    })

    // 用户注销
    $("#myhead").on("click", "#logoff", function () {
        layer.confirm('真的要注销账号吗?', { icon: 3, title: '注销', btn: ["取消", "注销"] }, function (index) {
            console.log("1")
            layer.close(index);
            return false;
        }, function (index) {
            console.log("2")
            layer.msg("注销中");
            $.ajax({
                url: app_root + "/user/reg",
                type: "delete",
                dataType: "json",
                xhrFields: {
                    withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
                },
                crossDomain: true,
                headers: {
                    "X-CSRFToken": get_csrf_token(),
                },
                // contentType: "application/x-www-form-urlencoded", // 不要动这里！动者死！
            }).done(function (msg) {
                if (msg.state == "ok") {
                    location.reload();
                }
            }).fail(function (e) {
                console.log(e)
                if(e.responseJSON.msg=="ban"){
                    layer.msg("拒绝，内含敏感词汇");
                }else if(e.status==403 &&e.responseJSON.msg=="jump to login"){
                    layer.msg("请登录");
                }else{
                    layer.msg(e.status);
                }
            })
        });
    })
})