$(function(){

    $("#user-password").blur(function () {
        var reg = /^\w+$/;
        if ((!reg.test($("#user-password").val()))||($("#user-password").val().length < 6)) {
            $("#user-password").val("");
            $("#tip-password").text("请使用数字、字母、下划线，且长度不小于6位。");
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

    $("#user-email").blur(function () {
        var reg = /^[a-z0-9._%-]+@([a-z0-9-]+\.)+[a-z]{2,4}$|^1[3|4|5|7|8]\d{9}$/;
        if ((!reg.test($("#user-email").val()))||($("#user-email").val().length < 6)) {
            $("#user-email").val("");
            $("#tip-user-email").text("邮件格式错误。");
        }else{
            $("#tip-user-email").text("");
        }
    })

    // 获取验证码 start
    $("#get-verify").click(function(){
        var email = $("#user-email").val();
        if(email==""){
            layer.msg("输入邮箱后验证");
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
            url:app_root+"/user/change",
            type:"get",
            dataType:"json",
            data:{
                "email":email,
            },
        }).done(function(msg){
            if(msg.state=="ok"){
                layer.msg("邮件已发送，有效期5分钟");
            }else if(msg.state=="fail"){
                if(msg.msg=="email not exist"){
                    layer.msg("邮箱未注册");
                }else if(msg.msg=="send failed"){
                    layer.msg("发送失败，请稍后重试");
                }else{
                    layer.msg("数据发生错误，请稍后重试");
                }
            }
        }).fail(function(e){
            console.log(e);
            layer.msg("出现错误！")
        })
    })

    // 点击注册
    $("#submit").click(function(){
        var passwd = $("#user-password").val();
        var passwd_check = $("#user-password-check").val();
        var email = $("#user-email").val();
        var verify = $("#user-verify").val();

        if(passwd=="" || passwd_check=="" || email=="" || verify==""){
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
            url:app_root+"/user/change",
            type:"post",
            dataType:"json",
            data:{
                new_passwd:passwd,
                email:email,
                verify_code:verify
            }
        }).done(function(msg){
            if(msg.state=="ok"){
                layer.msg("修改成功");
                location.href="/user/login.html";
            }else if(msg.msg=="user not exist"){
                layer.msg("用户未注册");
            }else if(msg.msg=="not verified"){
                layer.msg("验证错误，请重试");
            }else if(msg.msg=="databases save failed"){
                layer.msg("数据发生错误，请稍后重试");
            }
        }).fail(function(e){
            console.log(e)
            layer.msg("服务器出现错误，请稍后再试，或联系管理员")
        })

    })


})