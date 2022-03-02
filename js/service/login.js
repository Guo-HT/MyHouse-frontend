$(function () {
    $("#user-password").blur(function () {
        var reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z._~!@#$^&*]+$)(?![a-z0-9]+$)(?![a-z._~!@#$^&*]+$)(?![0-9._~!@#$^&*]+$)[a-zA-Z0-9._~!@#$^&*]{8,}$/;
        if (!reg.test($("#user-password").val())) {
            $("#user-password").val("");
            $("#tip-password").text("要求包含大、小写字母，数字，特殊字符(_!@#$%^&*()+.)的组合（至少三种），不能低于8位");
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
        $.cookie("csrftoken", get_csrf_token());
        $.ajax({
            url:app_root+"/user/service_log",
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
            // contentType: "application/x-www-form-urlencoded", // 不要动这里！动者死！
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function(msg){
            if(msg.state=="ok"){
                location.href = "/service/chat_service.html";
            }
            else{
                layer.msg("用户名或密码错误！")
            }
        }).fail(function(e){
            layer.msg("登录失败！请稍后重试");
        })
    })
})