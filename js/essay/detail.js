$(function () {
    layui.use("layer", function () {
        var layer = layui.layer;
    })

    // 点赞，点过-1，没点过+1
    $("#do_good").click(function () {
        if($.cookie("is_login")!="true"){
            location.href="/user/login.html";
        }
        var paramsStr = window.location.search
        var params = new URLSearchParams(paramsStr)
        var id = params.get('id') // list
        if (!id) {
            id = 1;
        }
        $.ajax({
            url: app_root + "/essay/do_good",
            type: "post",
            dataType: "json",
            data: {
                id: id,
            },
            xhrFields: {
                withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
            },
            crossDomain: true,
        }).done(function (msg) {
            $("#good_num").html(msg.msg.good_num);
            $("#good_num_2").html(msg.msg.good_num);
        }).fail(function (e) {
            console.log(e);
        })
    })

    // 点击分享 链接拷贝至剪切板
    $("#share").click(function () {
        var transfer = document.createElement('input');
        document.body.appendChild(transfer);
        transfer.value = location.href;  // 这里表示想要复制的内容
        transfer.focus();
        transfer.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
        }
        transfer.blur();
        document.body.removeChild(transfer);
        layer.msg("已复制到剪切板");
    })

    // 搜索 跳转页面
    $("#search_btn").click(function(){
        var search = $("#search_input").val();
        location.href = "/org/index.html?search="+search+"&p=1";
    })

    // 获取近期文章 top5
    $.ajax({
        url: app_root + "/essay/details",
        type:"get",
        dataType:"json",
        data:{
            list_for:"recent",
        }
    }).done(function(msg){
        if(msg.state=="ok"){
            // console.log(msg.msg);
            var html="";
            for(var i=0; i<msg.msg.length;i++){
                html+="<li><a href=\"/org/essay.html?id="+msg.msg[i].id+"\"><span>"+msg.msg[i].title+'</span>&nbsp;<i><svg t="1642753378290" class="icon" viewbox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5548" width="18" height="18"><path d="M510.557138 204.354248c-302.839283 0-458.323497 306.150702-458.323497 306.150702s117.330242 306.189587 458.323497 306.189587c308.802088 0 458.300984-304.995389 458.300984-304.995389S818.167075 204.354248 510.557138 204.354248L510.557138 204.354248 510.557138 204.354248zM511.245823 701.866279c-110.729917 0-190.772928-83.72589-190.772928-191.364399 0-107.647719 80.049151-191.352119 190.772928-191.352119 110.723777 0 190.763718 83.697237 190.763718 191.352119C702.010565 618.140389 621.970624 701.866279 511.245823 701.866279L511.245823 701.866279 511.245823 701.866279zM511.245823 395.675668c-63.286372 0.145309-114.460892 53.321416-114.460892 114.827235 0 61.473073 51.175543 114.821095 114.460892 114.821095 63.282279 0 114.453728-53.352115 114.453728-114.821095C625.703645 448.975595 574.529125 395.556964 511.245823 395.675668L511.245823 395.675668 511.245823 395.675668z" p-id="5549" fill="#bfbfbf"></path></svg></i>'+
                "&nbsp;<span>"+msg.msg[i].watch_num+"</span></a></li>";
            }
        }else{
            html+="<li>出现错误...</li>"
        }
        $("#recent_essay").html(html);
        
    }).fail(function(e){
        console.log(e)
    })

    // 获取近期文章 top5
    $.ajax({
        url: app_root + "/essay/details",
        type:"get",
        dataType:"json",
        data:{
            list_for:"hot",
        }
    }).done(function(msg){
        if(msg.state=="ok"){
            // console.log(msg.msg);
            var html="";
            for(var i=0; i<msg.msg.length;i++){
                html+="<li><a href=\"/org/essay.html?id="+msg.msg[i].id+"\"><span>"+msg.msg[i].title+'</span>&nbsp;<i><svg t="1642753378290" class="icon" viewbox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5548" width="18" height="18"><path d="M510.557138 204.354248c-302.839283 0-458.323497 306.150702-458.323497 306.150702s117.330242 306.189587 458.323497 306.189587c308.802088 0 458.300984-304.995389 458.300984-304.995389S818.167075 204.354248 510.557138 204.354248L510.557138 204.354248 510.557138 204.354248zM511.245823 701.866279c-110.729917 0-190.772928-83.72589-190.772928-191.364399 0-107.647719 80.049151-191.352119 190.772928-191.352119 110.723777 0 190.763718 83.697237 190.763718 191.352119C702.010565 618.140389 621.970624 701.866279 511.245823 701.866279L511.245823 701.866279 511.245823 701.866279zM511.245823 395.675668c-63.286372 0.145309-114.460892 53.321416-114.460892 114.827235 0 61.473073 51.175543 114.821095 114.460892 114.821095 63.282279 0 114.453728-53.352115 114.453728-114.821095C625.703645 448.975595 574.529125 395.556964 511.245823 395.675668L511.245823 395.675668 511.245823 395.675668z" p-id="5549" fill="#bfbfbf"></path></svg></i>'+
                "&nbsp;<span>"+msg.msg[i].watch_num+"</span></a></li>";
            }
        }else{
            html+="<li>出现错误...</li>"
        }
        $("#hot_essay").html(html);
        
    }).fail(function(e){
        console.log(e)
    })


})

