$(function () {

    var paramsStr = window.location.search
    var params = new URLSearchParams(paramsStr)
    var id = params.get('id') // list
    var type = params.get('type')
    console.log(id, type);
    if(id!=undefined && type!=undefined){
        $("#machine_data_iframe").attr({"src": "/machine/iframe/" + WORK_TYPE[type] + ".html?id="+id + "&type=" + type})
    }


    function get_machine_list() {
        $.ajax({
            url: app_root + "/data/machine",
            type: "get",
            dataType: "json",
            xhrFields: {
                withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
            },
            crossDomain: true,
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function (msg) {
            // console.log(msg);
            if (msg.state == "ok") {
                var html = "";
                for (var i = 0; i < msg.msg.length; i++) {
                    var dot_class = msg.msg[i].is_online ? "online" : "offline";
                    var sn = msg.msg[i].sn;
                    var id = msg.msg[i].id;
                    var machine_name = msg.msg[i].machine_name;
                    var worktype = WORK_TYPE[msg.msg[i].work_type];

                    html = html + '<li class="machine_li"><div class="layui-card" title="' + machine_name + '"><div class="layui-card-body">' +
                        '<img src="/img/' + worktype + '.jpg" alt="图片"><input type="hidden" class="work_type" value="'+msg.msg[i].work_type+'"><input type="hidden" class="machine_id" value="' + id +
                        '"/></div><div class="layui-card-header"><span class="machine_name">' + machine_name + '</span>' +
                        '<span class="layui-badge-dot dot ' + dot_class + '"></span></div></div></li>';
                }
                $("#machine_list").html(html);
            }
        }).fail(function (e) {
            console.log(e);
        })
    }
    get_machine_list();

    function get_machine_status(){
        $.ajax({
            url:app_root + '/data/status',
            type:"get",
            dataType: "json",
            xhrFields: {
                withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
            },
            crossDomain: true,
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function(msg){
            var data=msg.msg;
            // console.log(data);
            var $list = $(".machine_li")
            var machine_num = $list.length;
            for(var i=0; i<machine_num; i++){
                var machine_id = $list.eq(i).find(".machine_id").val();
                var dot_class = data[machine_id] ? "online" : "offline";
                $list.eq(i).find(".dot").removeClass("online").removeClass("offline").addClass(dot_class);
            }
        }).fail(function(e){
            console.log(e)
        })
    }
    get_machine_status();
    t_status = setInterval(get_machine_status, 10000);

    $("#machine_list").on("click", ".machine_li", function(){
        var machine_id = $(this).find(".machine_id").val();
        var work_type = $(this).find(".work_type").val();
        $("#machine_data_iframe").attr({"src": "/machine/iframe/"+WORK_TYPE[work_type]+".html?id="+machine_id+"&type="+work_type})
	history.pushState({}, null, location.origin + location.pathname +"?type=" + work_type + "&id=" + machine_id);
    })
})
