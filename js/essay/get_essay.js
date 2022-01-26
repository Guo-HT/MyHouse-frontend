$(function(){
    var paramsStr = window.location.search
    var params = new URLSearchParams(paramsStr)
    var id = params.get('id') // list
    if (!id) {
        id = 1;
    }
    $.ajax({
        url:app_root+"/essay/detail",
        type:"get",
        dataType:"json",
        data:{
            id:id
        },
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        },
        crossDomain: true,
    }).done(function(msg){
        // console.log(msg);
        if(msg.state=="ok"){
            var data = msg.msg;
            $("#title").text(data.title);
            $("#upload_time").text(data.create_time);
            $("#upload_user").text(data.user);
            $("#good_num").text(data.good_num);
            $("#good_num_2").text(data.good_num);
            $("#commend_num").text(data.comment_num);
            $("#essay_content").html(data.content);
            $("#watch_num").text(data.watch_num)
            if(data.is_collect=="true"){
                $("#collect_tip").text("已收藏");
            }else{
                $("#collect_tip").text("收藏");
            }
        }
    }).fail(function(e){
        console.log(e);
    })



})