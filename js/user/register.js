$(function(){
    layui.use('layer', function () {
        var layer = layui.layer;
    });

    $("#user-name").blur(function () {
        var reg = /^\w+$/;
        if ((!reg.test($("#user-name").val()))||($("#user-name").val().length < 8)) {
            $("#user-name").val("");
            $("#tip-user-name").text("请使用数字、字母、下划线，且长度不小于8位。");
        }else{
            $("#tip-user-name").text("");
        }
    })
    $("#user-password").blur(function () {
        var reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z._~!@#$^&*]+$)(?![a-z0-9]+$)(?![a-z._~!@#$^&*]+$)(?![0-9._~!@#$^&*]+$)[a-zA-Z0-9._~!@#$^&*]{8,}$/;
        if ((!reg.test($("#user-password").val()))||($("#user-password").val().length < 6)) {
            $("#user-password").val("");
            $("#tip-password").text("要求包含大、小写字母，数字，特殊字符(_!@#$%^&*()+.)的组合（至少三种），不能低于8位");
        }else{
            $("#tip-password").text("");
        }
    })
    $("#user-password-check").blur(function () {
        var reg = /^\w+$/;
        if ((!reg.test($("#user-password-check").val()))||($("#user-password-check").val().length < 6)) {
            $("#user-password-check").val("");
            $("#tip-password-check").text("请使用数字、字母、下划线，且长度不小于6位。");
        }else{
            $("#tip-password-check").text("");
        }
    })

    // 获取验证码 start
    $("#get-verify").click(function(){
        var email = $("#user-email").val();
        if(email==""){
            layer.msg("输入邮箱后验证");
            return;
        }
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if(!reg.test(email)){
            layer.msg("请检查邮箱格式");
            return;
        }
        //点击后按钮不可用
        $(this).attr("disabled", true);
        // 六十秒后按钮可用
        var rest_time = 60;
        var timer_60s = setInterval(function () {
            $("#get-verify").val(rest_time + "秒后重试");
            rest_time--;
            if (rest_time < 0) {
                $("#get-verify").val("获取验证码")
                $("#get-verify").removeAttr("disabled");
                clearInterval(timer_60s);
            }
        }, 1000);
        $.ajax({
            url:app_root+"/user/reg",
            type:"get",
            dataType:"json",
            data:{
                "email":email,
            },
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },xhrFields: {
                withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
            },crossDomain:true,
        }).done(function(msg){
            if(msg.state=="ok"){
                layer.msg("邮件已发送，有效期5分钟");
            }else if(msg.state=="fail"){
                if(msg.msg=="email exist"){
                    layer.msg("邮箱已注册");
                }else{
                    layer.msg("发送失败，请稍后重试");
                }
            }
        })
    })

    // 点击注册
    $("#submit").click(function(){
        var name = $("#user-name").val();
        var passwd = $("#user-password").val();
        var passwd_check = $("#user-password-check").val();
        var email = $("#user-email").val();
        var verify = $("#user-verify").val();

        if(name=="" || passwd=="" || passwd_check=="" || email=="" || verify==""){
            layer.msg("请完整填写信息！");
            return;
        }
        else if(passwd!=passwd_check){
            $("#user-password").val("");
            $("#user-password-check").val("");
            layer.msg("请重新确认密码！");
            return;
        }
        $.ajax({
            url:app_root+"/user/reg",
            type:"post",
            dataType:"json",
            data:{
                name:name,
                passwd:passwd,
                email:email,
                verify:verify
            },xhrFields: {
                withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
            },crossDomain: true,
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function(msg){
            if(msg.state=="ok"){
                layer.msg("注册成功");
                location.href="/user/login.html";
            }else if(msg.msg=="user has existed"){
                layer.msg("用户已被注册");
            }else if(msg.msg=="wrong or timeout"){
                layer.msg("超时或发生错误");
            }
        }).fail(function(e){
            console.log(e)
            layer.msg("服务器出现错误，请稍后再试，或联系管理员")
        })
    })
})