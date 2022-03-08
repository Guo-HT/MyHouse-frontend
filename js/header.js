$(function () {
    var header_html = '<ul class="layui-nav nav-left" lay-filter="">' +
        '</li><li class="layui-nav-item"><a href="/index.html"><img src="/img/MyHouse.svg" class="layui-nav-img title_icon" title="智能家居">MyHouse智能家居</a>' +
        // '<li class="layui-nav-item"><a href="/index.html">主页</a></li>'+
        '<li class="layui-nav-item"><a href="/org/index.html">社区</a></li>' +
        '<li class="layui-nav-item"><a href="/machine/data.html">我的房间</a></li>' +
        '<li class="layui-nav-item"><a href="/machine/bind.html">设备绑定</a></li>' +
        '<li class="layui-nav-item"><a href="/machine/link.html">设备联动</a></li></ul>' +
        '<ul class="layui-nav nav-right" id="nav-right">' +
        '<li class="layui-nav-item"><a href="/user/login.html">发表文章<span class="layui-badge">0</span></a>' +
        '</li><li class="layui-nav-item"><a href="javascript:void(0);" id="user-self"><img src="/img/default-head.png" class="layui-nav-img" id="header_head_photo" title="头像">我</a>' +
        '</li><li class="layui-nav-item"><a href="/user/login.html">登录</a></li>' +
        '<li class="layui-nav-item"><a href="/user/register.html">注册</a></li></ul>';
    $("#myhead").html(header_html);

    //注意：选项卡 依赖 element 模块，否则无法进行功能性操作
    layui.use('element', function () {
        var element = layui.element;

        //…
    });

    /* 鼠标特效 */
    var a_idx = 0;
    jQuery(document).ready(function ($) {
        $("body").click(function (e) {
            var a = new Array("❤富强❤", "❤民主❤", "❤文明❤", "❤和谐❤", "❤自由❤", "❤平等❤", "❤公正❤", "❤法治❤", "❤爱国❤", "❤敬业❤", "❤诚信❤", "❤友善❤");
            var $i = $("<span></span>").text(a[a_idx]);
            a_idx = (a_idx + 1) % a.length;
            var x = e.pageX,
                y = e.pageY;
            $i.css({
                "z-index": 999999999999999999999999999999999999999999999999999999999999999999999,
                "top": y - 20,
                "left": x,
                "position": "absolute",
                "font-weight": "bold",
                "color": "rgb(" + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + ")"
            });
            $("body").append($i);
            $i.animate({
                "top": y - 180,
                "opacity": 0
            },
                1500,
                function () {
                    $i.remove();
                });
        });
    });
})