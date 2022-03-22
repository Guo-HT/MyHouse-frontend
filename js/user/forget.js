$(function(){
    $("#user-password").blur(function () {
        var reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z._~!@#$^&*]+$)(?![a-z0-9]+$)(?![a-z._~!@#$^&*]+$)(?![0-9._~!@#$^&*]+$)[a-zA-Z0-9._~!@#$^&*]{8,}$/;
        if ((!reg.test($("#user-password").val()))||($("#user-password").val().length < 6)) {
            $("#user-password").val("");
            $("#tip-password").text("要求包含大、小写字母，数字，特殊字符(_!@#$%^&*()+.)的组合，不能低于8位");
        }else{
            $("#tip-password").text("");
        }
    })
    $("#user-password-check").blur(function () {
        var reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z._~!@#$^&*]+$)(?![a-z0-9]+$)(?![a-z._~!@#$^&*]+$)(?![0-9._~!@#$^&*]+$)[a-zA-Z0-9._~!@#$^&*]{8,}$/;
        if ((!reg.test($("#user-password-check").val()))||($("#user-password-check").val().length < 6)) {
            $("#user-password-check").val("");
            $("#tip-password-check").text("要求包含大、小写字母，数字，特殊字符(_!@#$%^&*()+.)的组合，不能低于8位");
        }else{
            $("#tip-password-check").text("");
        }
    })

    $("#user-email").blur(function () {
        var reg = /^[a-z0-9._%-]+@([a-z0-9-]+\.)+[a-z]{2,4}$|^1[3|4|5|7|8]\d{9}$/;
        if (!reg.test($("#user-email").val())) {
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
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function(msg){
            if(msg.state=="ok"){
                layer.msg("邮件已发送，有效期5分钟");
            }
        }).fail(function(e){
            console.log(e);
            if(e.status==403){
                if(e.responseJSON.msg=="wait"){
                    layer.msg("频率限制，请稍后再试")
                }else if(e.responseJSON.msg=="user not exist"){
                    layer.msg("用户不存在");
                }else if(e.responseJSON.msg=="ban"){
                    layer.msg("拒绝，内含敏感词汇");
                }
            }else if(e.status==500){
                layer.msg("发生错误，请稍后再试");
            }


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
            },
            xhrFields: {
                withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
            },
            crossDomain:true,
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function(msg){
            if(msg.state=="ok"){
                layer.msg("修改成功");
                location.href="/user/login.html";
            }
        }).fail(function(e){
            console.log(e)
            if(e.status==403){
                if(e.responseJSON.msg=="format error"){
                    layer.msg("信息格式错误")
                }else if(e.responseJSON.msg=="user not exist"){
                    layer.msg("用户不存在")
                }else if(e.responseJSON.msg=="not verified"){
                    layer.msg("验证错误")
                }else if(e.responseJSON.msg=="ban"){
                    layer.msg("拒绝，内含敏感词汇");
                }
            }else if(e.status==500){
                layer.msg("发生错误");
            }
        })
    })
})
