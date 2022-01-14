$(function(){
    var header_html = '<ul class="layui-nav nav-left" lay-filter=""><li class="layui-nav-item"><a href="/index.html">主页</a></li>'+
    '<li class="layui-nav-item"><a href="/org/index.html">社区</a></li><li class="layui-nav-item"><a href="/mine/index.html">我的设备</a></li></ul><ul class="layui-nav nav-right" id="nav-right">'+
    '<li class="layui-nav-item">'+
    '<a href="/user/login.html">历史记录<span class="layui-badge-dot"></span></a></li><li class="layui-nav-item"><a href="/user/login.html">发表文章<span class="layui-badge">0</span></a>'+
    '</li><li class="layui-nav-item"><a href="javascript:void(0);" id="user-self"><img src="/img/default-head.png" class="layui-nav-img">我</a>'+
    '</li><li class="layui-nav-item"><a href="/user/login.html">登录</a></li><li class="layui-nav-item"><a href="/user/register.html">注册</a></li></ul>';
    $("#myhead").html(header_html);    
})