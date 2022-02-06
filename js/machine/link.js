$(function () {
    var upper_machine_id = "";
    var lower_machine_id = "";

    layui.use("layer", function () {
        var layer = layui.layer;
    })

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
            var machine_list = msg.msg;
            var html_opt_upper = '';
            var html_opt_lower = '';
            for (var i = 0; i < machine_list.length; i++) {
                if (machine_list[i].work_type == 1) {  // 灯
                    html_opt_upper = html_opt_upper + '<option value="' + machine_list[i].id + '" type="' + machine_list[i].work_type + '" data="LED_state">' + machine_list[i].machine_name + '</option>';
                    html_opt_lower = html_opt_lower + '<option value="' + machine_list[i].id + '" type="' + machine_list[i].work_type + '" data="LED_state">' + machine_list[i].machine_name + '</option>';

                }
                if (machine_list[i].work_type == 2) {  // dht11
                    html_opt_upper = html_opt_upper + '<option value="' + machine_list[i].id + '" type="' + machine_list[i].work_type + '" data="temp">' + machine_list[i].machine_name + '-温度</option>';
                    html_opt_upper = html_opt_upper + '<option value="' + machine_list[i].id + '" type="' + machine_list[i].work_type + '" data="humidity">' + machine_list[i].machine_name + '-湿度</option>';
                }
            }
            $("#upper_machine").append(html_opt_upper);
            $("#lower_machine").append(html_opt_lower);
        }
    }).fail(function (e) {
        console.log(e);
    })

    $("#upper_machine").on("change", function () {
        upper_machine_id = $(this).val();
        // console.log(upper_machine_id, lower_machine_id);
        if (upper_machine_id) {
            $("#upper_machine").css({ "color": "#333333" });
        } else {
            $("#upper_machine").css({ "color": "#757575" });
        }
        var type = $(this).find("option:selected").attr("type");
        var data_item = $(this).find("option:selected").attr("data");
        if (type === undefined) {
            $("#condition_num").removeAttr("disabled");
            $("#condition").html('<option value="">请选择触发条件</option>')
        }
        else if (WORK_TYPE[type] == "light") {
            $("#condition_num").attr("disabled", "disabled").attr({ "placeholder": "不可用" });
            $("#condition").html('<option value="">请选择触发条件</option><option value="1">开</option><option value="0">关</option>');
        } else if (WORK_TYPE[type] == "dht11") {
            if (data_item == "temp") {
                $("#condition_num").removeAttr("disabled").attr({ "placeholder": "摄氏度" });
            } else if (data_item == "humidity") {
                $("#condition_num").removeAttr("disabled").attr({ "placeholder": "湿度" });
            }
            $("#condition").html('<option value="">请选择触发条件</option><option value="gt">高于</option><option value="lt">低于</option>');
        }
    })

    $("#lower_machine").on("change", function () {
        lower_machine_id = $(this).val();
        // console.log(upper_machine_id, lower_machine_id);
        if (lower_machine_id) {
            $("#lower_machine").css({ "color": "#333333" });
        } else {
            $("#lower_machine").css({ "color": "#757575" });
        }

        var type = $(this).find("option:selected").attr("type");
        var data_item = $(this).find("option:selected").attr("data");
        if (type === undefined) {
            $("#command_num").removeAttr("disabled");
            $("#command").html('<option value="">请选择执行动作</option>');
        } else if (WORK_TYPE[type] == "light") {
            $("#command_num").attr("disabled", "disabled").attr({ "placeholder": "不可用" });
            $("#command").html('<option value="">请选择执行动作</option><option value="1">开</option><option value="0">关</option>');
        } else if (WORK_TYPE[type] == "dht11") {
            ;
        }
    })

    // 提交发送按钮
    $("#submit_btn").click(function () {
        upper_machine_id = upper_machine_id;
        var upper_type = $("#upper_machine").find("option:selected").attr("type");
        var data_item = $("#upper_machine").find("option:selected").attr("data");
        var condition = $("#condition").val();
        var condition_num = $("#condition_num").val();

        lower_machine_id = lower_machine_id;
        var lower_type = $("#lower_machine").find("option:selected").attr("type");
        var command = $("#command").val();
        var command_num = $("#command_num").val();

        if (upper_type == 1) {
            condition_num = condition ? '1' : '0';
            condition = "eq";
        }
        if (lower_type == 1) {
            command_num = command ? '1' : '0';
            command = "eq";
        }
        // console.log(upper_machine_id);
        // console.log(condition);
        // console.log(condition_num);
        // console.log(data_item);
        // console.log(lower_machine_id);
        // console.log(command);
        // console.log(command_num);
        if (upper_machine_id == "" || condition == "" || data_item == "" || condition_num == "" || lower_machine_id == "" || command == "" || command_num == "") {
            layer.msg("请完整填写");
            return;
        }

        $.ajax({
            url: app_root + "/data/get_machine_link",
            type: "post",
            dataType: "json",
            data: {
                upper_machine_id: upper_machine_id,
                condition: condition,
                data_item: data_item,
                condition_num: condition_num,
                lower_machine_id: lower_machine_id,
                command: command,
                command_num: command_num,
            },
            xhrFields: {
                withCredentials: true,
            },
            crossDomain: true,
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function (msg) {
            console.log(msg);
            if (msg.state = "ok") {
                layer.msg("提交成功");
            }
        }).fail(function (e) {
            console.log(e);
        })
    })

    // 获取绑定条目
    function show_already_link(page) {
        $.ajax({
            url: app_root + "/data/get_machine_link",
            type: "get",
            dataType: "json",
            data: {
                page: page,
            },
            xhrFields: {
                withCredentials: true,
            },
            crossDomain: true,
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function (msg) {
            console.log(msg);
            if (msg.state == "ok") {
                // console.log(msg.page_num);
                layui.use('laypage', function () {
                    var laypage = layui.laypage;
                    //执行一个laypage实例
                    laypage.render({
                        elem: 'page_nav', //注意，这里的 test1 是 ID，不用加 # 号
                        count: msg.total_count, //数据总数，从服务端得到
                        limit: msg.per_page,  //
                        curr: page,
                        jump: function (obj, first) {
                            //obj包含了当前分页的所有参数，比如：
                            // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                            // console.log(obj.limit); //得到每页显示的条数
                            //首次不执行
                            if (!first) {
                                //do something
                                show_already_link(obj.curr);
                            }
                        },
                        layout: ['prev', 'page', 'next', 'count'],
                    });
                });

                var link_length = msg.msg.length;
                var html_li = "";
                for (var i = 0; i < link_length; i++) {
                    var data = msg.msg[i];
                    html_li = html_li + '<li class="layui-col-md3 layui-col-sm4 layui-col-xs6 link_list_li">' +
                        '<input type="hidden" name="link_id" value="'+data.link_id+'" id="link_id"><input type="hidden" name="upper_id" value="'+data.upper_id+'" id="upper_id">' +
                        '<input type="hidden" name="lower_id" value="'+data.lower_id+'" id="lower_id"><div class="link_list_content"><div class="link_content">当' +
                        '<span class="machine_name_em">'+xss_defender(data.upper_name)+'</span>，<span>'+convert_data_item(data.data_item)+'</span><span>'+convert_logic(data.condition)+'</span><span>'+data.condition_num+'</span>时<br>' +
                        '<span class="machine_name_em">'+xss_defender(data.lower_name)+'</span><span>状态</span>置<span>'+data.command_num+'</span></div>' +
                        '<div class="link_cut"><button class="layui-btn layui-btn-xs" id="cut_link_btn">解除</button></div></div></li>';
                }
                $("#link_list_ul").html(html_li);
            }

        }).fail(function (e) {
            console.log(e);
        })
    }
    show_already_link(1);

    function convert_logic(word){
        if(word=="gt"){
            return ">";
        }else if(word == "lt"){
            return "<";
        }else if(word == "eq"){
            return "=";
        }
    }

    function convert_data_item(word){
        if(word=="LED_state"){
            return "开关";
        }else if(word == "temp"){
            return "温度";
        }else if(word == "humidity"){
            return "湿度";
        }
    }

    $("#link_list_ul").on("click", "#cut_link_btn", function(){
        layer.confirm('真的要删除联动吗?', { icon: 3, title: '删除', btn: ["取消", "删除"] }, function (index) {
            console.log("1")
            layer.close(index);
            return false;
        }, function (index) {
            console.log("2")
            layer.msg("删除中");
            var link_id = $(this).parent().parent().parent().find("#link_id").val();
            var upper_id = $(this).parent().parent().parent().find("#upper_id").val();
            var lower_id = $(this).parent().parent().parent().find("#lower_id").val();
            // console.log(link_id, upper_id, lower_id);
    
            $.ajax({
                url: app_root + "/data/get_machine_link",
                type:"delete",
                dataType:"json",
                data:{
                    link_id: link_id,
                },
                xhrFields: {
                    withCredentials: true,
                },
                crossDomain: true,
                headers: {
                    "X-CSRFToken": get_csrf_token(),
                },
            }).done(function(msg){
                console.log(msg);
                if(msg.state=="ok"){
                    layer.msg("已删除");
                    show_already_link(1);
                }
            })
        })
    })
})