$(function () {
    layui.use("layer", function () {
        var layer = layui.layer;
    })

    $("#essay-submit").click(function () {
        var title = $("#essay-title").val();
        var content = CKEDITOR.instances.rich_editor.getData();
        if (title == "" || content == "") {
            layer.msg("请完整编辑");
            return;
        }
        layer.confirm("确认提交？", {
            icon: 3,
            title: "提示",
            btn: ["确认", "取消"],
        }, function (index) {
            console.log("1");
            upload_essay()
            return false;
        }, function (index) {
            console.log("2");
        });

    })

    function upload_essay() {
        var title = $("#essay-title").val();
        var content = CKEDITOR.instances.rich_editor.getData();

        $.ajax({
            url: app_root + "/essay/detail/",
            type: "post",
            dataType: "json",
            data: {
                title: title,
                content: content,
            },
            xhrFields: {
                withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
            },
            crossDomain: true,
            contentType: "application/x-www-form-urlencoded", // 不要动这里！动者死！
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function (msg) {
            console.log(msg);
            if (msg.state == "ok") {
                location.href = "/org/index.html";
            }
        }).fail(function (e) {
            console.log(e);
            if(e.status==403 &&e.responseJSON.msg=="jump to login"){
                layer.msg("请登录");
            }
            layer.msg("出现错误！请稍后重试");
        })
    }

})