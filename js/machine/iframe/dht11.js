$(function () {
    layui.use("layer", function () {
        const layer = layui.layer;

        var paramsStr = window.location.search
        var params = new URLSearchParams(paramsStr)
        var id = params.get('id') // list
        var type = params.get('type') // list
        if (!id || !type) {
            layer.msg("页面错误");
            return;
        } else {
            ;
        }
    })
    var myChart_temp = echarts.init(document.getElementById("temperature_clock"));
    option_temp = {
        tooltip: {
            formatter: "{a} <br/>{b} : {c}℃"
        },
        series: [
            {
                name: '温度',
                type: 'gauge',
                center: ["50%", "60%"],
                min: -20,//最小值
                max: 60,//最大值
                splitNumber: 20, //刻度的个数
                radius: "100%",//大小
                pointer: {  //指针
                    width: 10,
                    length: '90%',
                },
                axisLabel: { //刻度的大小
                    distance: 25,
                    textStyle: {
                        fontSize: 12,
                    },
                },
                axisLine: { //外轮廓的宽度
                    lineStyle: {
                        width: 20,
                        color: [
                            [0.5, "#4dabf7"],
                            [0.65, "#69db7c"],
                            [0.8, "#ffa94d"],
                            [1, "#ff6b6b"]
                        ],
                    },

                },
                splitLine: { //刻度线的长度和宽度
                    length: 15,
                    lineStyle: {
                        width: 1,
                    }
                },
                detail: {
                    formatter: '{value}℃',
                    textStyhle: { //当前温度的文字大小
                        fontSize: 24
                    },
                },
                data: [{
                    value: 50,
                    name: '温度',
                }]
            }
        ]
    };

    var myChart_humidity = echarts.init(document.getElementById("humidity_clock"));
    option_humidity = {
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
            {
                name: '湿度',
                type: 'gauge',
                center: ["50%", "60%"],
                min: 0,//最小值
                max: 100,//最大值
                splitNumber: 20, //刻度的个数
                radius: "100%",//大小
                pointer: {  //指针
                    width: 10,
                    length: '90%',
                },
                axisLabel: { //刻度的大小
                    distance: 25,
                    textStyle: {
                        fontSize: 12,
                    },
                },
                axisLine: { //外轮廓的宽度
                    lineStyle: {
                        width: 20,
                        color: [
                            [0.25, "#4dabf7"],
                            [0.5, "#69db7c"],
                            [0.75, "#ffa94d"],
                            [1, "#ff6b6b"]
                        ],
                    },

                },
                splitLine: { //刻度线的长度和宽度
                    length: 15,
                    lineStyle: {
                        width: 1,
                    }
                },
                detail: {
                    formatter: '{value}%',
                    textStyle: { //当前湿度度的文字大小
                        fontSize: 24
                    },
                },
                data: [{
                    value: 50,
                    name: '湿度',
                }]
            }
        ]
    };

    var myChart_temp_category = echarts.init(document.getElementById("temperature_category"));
    // 指定图表的配置项和数据
    var option_temp_category = {

        xAxis: {
            type: 'category',
            axisLabel: {
                rotate: 45,
            },
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }
        ]
    };

    var myChart_humidity_category = echarts.init(document.getElementById("humidity_category"));
    // 指定图表的配置项和数据
    var option_humidity_category = {
        xAxis: {
            type: 'category',
            axisLabel: {
                rotate: 45,
            },
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }
        ]
    };

    function setData() {
        var paramsStr = window.location.search
        var params = new URLSearchParams(paramsStr)
        var id = params.get('id') // list
        var type = params.get('type') // list
        $.ajax({
            url: app_root + "/data/get_data",
            type: "get",
            dataType: "json",
            data: {
                id: id,
                type: type,
            },
            xhrFields: {
                withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
            },
            crossDomain: true,
            headers: {
                "X-CSRFToken": get_csrf_token(),
            },
        }).done(function (msg) {
            console.log(msg);
            if (msg.state == "ok") {
                var last_temp = msg.msg[0].temp;
                var last_humidity = msg.msg[0].humidity;
                var temp_datas = [];
                var temp_times = [];
                var hudimity_datas = [];
                var hudimity_times = [];
                for (var i = msg.msg.length - 1; i >= 0; i--) {
                    temp_datas.push(msg.msg[i].temp);
                    temp_times.push(msg.msg[i].time.slice(11));
                    hudimity_datas.push(msg.msg[i].humidity);
                    hudimity_times.push(msg.msg[i].time.slice(11));
                }
                option_temp.series[0].data[0].value = last_temp;
                myChart_temp.setOption(option_temp, true);

                option_humidity.series[0].data[0].value = last_humidity;
                myChart_humidity.setOption(option_humidity, true);

                option_temp_category.series[0].data = temp_datas;
                option_temp_category.xAxis.data = temp_times;
                myChart_temp_category.setOption(option_temp_category);

                option_humidity_category.series[0].data = hudimity_datas;
                option_humidity_category.xAxis.data = hudimity_times;
                myChart_humidity_category.setOption(option_humidity_category);
            }
        }).fail(function (e) {
            console.log(e);
	    if(e.status==500){
	        layer.msg("错误，请检查设备类型与id是否正确");
	        clearInterval(timer1);
	    }
        })
    }
    setData();
    timer1 = setInterval(setData, 10000);


})
