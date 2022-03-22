$(function () {

    var slider;
    //一般直接写在一个js文件中
    layui.config({
        base: '/js/'
    }).extend({
        sliderVerify:"sliderVerify"
    }).use(['sliderVerify', 'jquery', 'form'], function() {
        var sliderVerify = layui.sliderVerify,
            form = layui.form;
        slider = sliderVerify.render({
            elem: '#slider',
            // onOk: function(){//当验证通过回调
            // 	// layer.msg("滑块验证通过");
            // },
            isAutoVerify: false,
            bg: "layui-bg-red",
            text: "滑 动 验 证"
        })
    })

    // $("#user-name").blur(function () {
    //     var reg = /^\w+$/;
    //     if ((!reg.test($("#user-name").val()))||($("#user-name").val().length < 8)) {
    //         $("#user-name").val("");
    //         $("#tip-user-name").text("请使用数字、字母、下划线，且长度不小于8位。");
    //     }else{
    //         $("#tip-user-name").text("");
    //     }
    // })

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
        else if(!slider.isOk()){
            layer.msg("请完成滑动验证");
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
        }).fail(function(e){
            if(e.status==403){
                if(e.responseJSON.msg=="format error"){
                    layer.msg("信息格式错误");
                }else if(e.responseJSON.msg=="user not exist" || e.responseJSON.msg=="password error"){
                    layer.msg("用户名或密码错误");
                }else if(e.responseJSON.msg=="ban"){
                    layer.msg("拒绝，内含敏感词汇");
                }
            }
            else{
                layer.msg("登录失败！请稍后重试");
            }
        })
    })
})