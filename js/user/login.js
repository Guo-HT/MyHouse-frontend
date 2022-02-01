$(function () {

    // $("#user-name").blur(function () {
    //     var reg = /^\w+$/;
    //     if ((!reg.test($("#user-name").val()))||($("#user-name").val().length < 6)) {
    //         $("#user-name").val("");
    //         $("#tip-user-name").text("请使用数字、字母、下划线，且长度不小于6位。");
    //     }else{
    //         $("#tip-user-name").text("");
    //     }
    // })

    $("#user-password").blur(function () {
        var reg = /^\w+$/;
        if ((!reg.test($("#user-password").val()))||($("#user-password").val().length < 6)) {
            $("#user-password").val("");
            $("#tip-password").text("请使用数字、字母、下划线，且长度不小于6位。");
        }else{
            $("#tip-password").text("");
        }
    })


    // 确认登录
    $("#submit").click(function () {
        layui.use('layer', function () {
            var layer = layui.layer;
        });
        // console.log(get_csrf_token());
        var user_name = $("#user-name").val();
        var user_password = $("#user-password").val();
        var is_remember = $("#is-remember").is(":checked");

        if (user_name == "" && user_password!="") {
            layer.msg('请填写用户名或邮箱');
            return;
        }
        else if(user_name!="" && user_password==""){
            layer.msg("请填写密码");
            return;
        }
        else if(user_name == "" && user_password == ""){
            layer.msg("请填写信息");
            return;
        }
        $.ajax({
            url:app_root+"/user/log",
            type:"post",
            dataType:"json",
            data:{
                "name":user_name,
                "passwd":user_password,
                "is_remember":is_remember
            },
            xhrFields: {
                withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
            },
            crossDomain: true,
            contentType: "application/x-www-form-urlencoded", // 不要动这里！动者死！
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function(msg){
            if(msg.state=="ok"){
                location.href = "/index.html";
            }
            else{
                layer.msg("用户名或密码错误！")
            }
        }).fail(function(e){
            layer.msg("登录失败！请稍后重试");
        })
    })
})