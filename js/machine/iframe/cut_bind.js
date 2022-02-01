$(function(){
    layui.use("layer", function(){
        var layer = layui.layer;
    })

    $("#cut_bind_btn").click(function () {
        layer.confirm('真的要解除绑定吗?', { icon: 3, title: '解除', btn: ["取消", "解除"] }, function (index) {
            console.log("1")
            layer.close(index);
            return false;
        }, function (index) {
            console.log("2")
            layer.msg("解除中");
            var paramsStr = window.location.search
            var params = new URLSearchParams(paramsStr)
            var id = params.get('id') // list
            var type = params.get('type') // list
            $.ajax({
                url:app_root+"/data/cut_bind",
                type:"post",
                dataType:"json",
                data:{
                    id: id,
                    type:type,
                },
                xhrFields: {
                    withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
                },
                crossDomain: true,
                headers: {
                    "X-CSRFToken": get_csrf_token(),
                },
            }).done(function(msg){
                console.log(msg);
                if(msg.state=="ok"){
                    layer.msg("解除成功");
                    parent.location.reload();
                }
            }).fail(function(e){
                console.log(e);
            })
        })
    })
})