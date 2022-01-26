$(function () {

    layui.use('upload', function () {
        var upload = layui.upload;
        var $ = layui.$;

        //ajax全局参数设置
        $.ajaxSetup({
            // async:false, // 默认true，异步
            // 发送cookie
            xhrFields: {
                withCredentials: true
            },
        });

        //执行实例
        var uploadInst = upload.render({
            elem: '#upload_head', //绑定元素
            url: app_root + '/user/addPhoto', //上传接口
            accept: "images",
            field: "photo",
            done: function (res) {
                //上传完毕回调
                var img_url = res.msg.url;
                $("#user_head").attr("src", app_root + img_url);
                $("#header_head_photo").attr("src", img_url);
            },
            error: function (e) {
                //请求异常回调
                console.log(e);
            }
        });
    });

})