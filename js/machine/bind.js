$(function () {
    layui.use(["element", "layer"], function () {
        var element = layui.element;
        var layer = layui.layer;
    })
    if ($.cookie("is_login") == "false" || $.cookie("is_login")==undefined) {
        location.href = "/user/login.html";
    }

    // 点击卡片，输入框打开
    $(".my_card").click(function () {
        var this_now_state = $(this).next(".sn_input_box").css("display");  // 获取当前状态
        if (this_now_state == "none") {  // 当前的即将展开
            $(this).parent().parent().siblings(".my_machine").find(".sn_input_box").slideUp();
        }
        $(this).siblings(".sn_input_box").slideToggle(300);
    })

    $(".do_bind").click(function () {
        var func = $(this).siblings(".func").val();
        var sn = $(this).siblings(".sn_input").val();
        var machine_name = $(this).siblings(".machine_name_input").val();

        if(machine_name=="" && sn==""){
            layer.msg("请完整输入信息");
            return;
        }
        else if (sn == "") {
            layer.msg("请输入序列号");
            return;
        }
        else if(machine_name==""){
            layer.msg("请输入设备名称，如：卧室的灯");
            return;
        }
        sn = sn.toUpperCase();
        var expre = /[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}/;
        var regexp = new RegExp(expre);
        if (!regexp.test(sn)) {
            layer.msg("SN码格式错误，请检查");
            return;
        }
        $(this).siblings(".sn_input").val("");
        $(this).siblings(".machine_name_input").val("")
        $.ajax({
            url: app_root + "/data/machine",
            type: "post",
            dataType: "json",
            data: {
                sn: sn,
                work_type: TYPE_WORK[func],
                machine_name: xss_defender(machine_name),
            },
            xhrFields: {
                withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
            },
            crossDomain: true,
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function (msg) {
            if (msg.state == "ok") {
                //显示自动关闭倒计秒数
                layer.alert('绑定成功，您可以在“我的房间”中查看\n如果需要修改名称，请解绑后重新绑定', {
                    time: 5 * 1000,
                    success: function (layero, index) {
                        var timeNum = this.time / 1000, setText = function (start) {
                            layer.title((start ? timeNum : --timeNum) + ' 秒后关闭', index);
                        };
                        setText(!0);
                        this.timer = setInterval(setText, 1000);
                        if (timeNum <= 0) clearInterval(this.timer);
                    },
                    end: function () {
                        clearInterval(this.timer);
                    }
                });
            }else if(msg.msg=="machine not exist"){
                layer.msg("设备不存在");
            }else if(msg.msg=="type not ok"){
                layer.msg("设备类型有误！");
            }else if(msg.msg=="belong to else"){
                layer.msg("其他用户已绑定该设备");
            }else if(msg.msg=="already bind"){
                layer.msg("您已绑定该设备");
            }else if(msg.msg=="jump to login"){
                layer.msg("请登录！");
            }
        })
    })

})