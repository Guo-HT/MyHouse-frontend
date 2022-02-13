$(function () {
    var chart_cpu_gauge = echarts.init(document.getElementById('cpu_gauge'));
    var option_cpu_gauge = {
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 100,
                splitNumber: 10,
                center: ["50%", "50%"], // 仪表位置
                axisLine: {
                    lineStyle: {
                        width: 6,
                        color: [
                            [0.25, '#FF6E76'],
                            [0.5, '#FDDD60'],
                            [0.75, '#58D9F9'],
                            [1, '#7CFFB2']
                        ]
                    }
                },
                pointer: {
                    icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                    length: '62%',
                    width: 4,
                    offsetCenter: [0, '-60%'],
                    itemStyle: {
                        color: 'auto'
                    }
                },
                axisTick: {
                    length: 8,
                    lineStyle: {
                        color: 'auto',
                        width: 2
                    }
                },
                splitLine: {
                    length: 14,
                    lineStyle: {
                        color: 'auto',
                        width: 3
                    }
                },
                axisLabel: {
                    color: '#464646',
                    fontSize: 20,
                    distance: -60,
                    formatter: function (value) {
                        return '';
                    }
                },
                title: {
                    offsetCenter: [0, '-10%'],
                    fontSize: 14
                },
                detail: {
                    fontSize: 20,
                    offsetCenter: [0, '-32%'],
                    valueAnimation: true,
                    formatter: function (value) {
                        return Math.round(value) + '%';
                    },
                    color: 'auto'
                },
                data: [
                    {
                        value: 0,
                        name: 'CPU占用率'
                    }
                ]
            }
        ]
    };

    var chart_mem_gauge = echarts.init(document.getElementById('mem_gauge'));
    var option_mem_gauge = {
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 100,
                splitNumber: 10,
                center: ["50%", "50%"], // 仪表位置
                axisLine: {
                    lineStyle: {
                        width: 6,
                        color: [
                            [0.75, '#E4984E'],
                            [1, '#E12A52']
                        ]
                    }
                },
                pointer: {
                    icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                    length: '62%',
                    width: 4,
                    offsetCenter: [0, '-60%'],
                    itemStyle: {
                        color: 'auto'
                    }
                },
                axisTick: {
                    length: 8,
                    lineStyle: {
                        color: 'auto',
                        width: 2
                    }
                },
                splitLine: {
                    length: 14,
                    lineStyle: {
                        color: 'auto',
                        width: 3
                    }
                },
                axisLabel: {
                    color: '#464646',
                    fontSize: 20,
                    distance: -60,
                    formatter: function (value) {
                        return '';
                    }
                },
                title: {
                    offsetCenter: [0, '-10%'],
                    fontSize: 14
                },
                detail: {
                    fontSize: 20,
                    offsetCenter: [0, '-32%'],
                    valueAnimation: true,
                    formatter: function (value) {
                        return Math.round(value) + '%';
                    },
                    color: 'auto'
                },
                data: [
                    {
                        value: 0,
                        name: '内存占用率'
                    }
                ]
            }
        ]
    };

    var chart_cache_gauge = echarts.init(document.getElementById('cache_gauge'));
    var option_cache_gauge = {
        series: [
            {
                type: 'gauge',
                center: ['50%', '80%'],
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 128,
                splitNumber: 8,
                itemStyle: {
                    color: '#FFAB91'
                },
                progress: {
                    show: true,
                    width: 12
                },
                pointer: {
                    show: true,
                    
                    icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                    length: '62%',
                    width: 4,
                    offsetCenter: [0, '-60%'],
                    itemStyle: {
                        color: 'auto'
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: 16,
                        color: [
                            [0.75, '#E4984E'],
                            [1, '#E12A52']
                        ]
                    }
                },
                axisTick: {
                    distance: -45,
                    splitNumber: 2,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                splitLine: {
                    distance: -52,
                    length: 14,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                axisLabel: {
                    distance: -45,
                    color: '#ffffff',
                    fontSize: 0
                },
                anchor: {
                    show: false
                },
                title: {
                    offsetCenter: [0, '-20%'],
                    fontSize: 12,
                    color: "#808080"

                },
                detail: {
                    valueAnimation: true,
                    width: '60%',
                    lineHeight: 16,
                    borderRadius: 8,
                    offsetCenter: [0, '-45%'],
                    fontSize: 12,
                    fontWeight: 'bolder',
                    formatter: '{value}',
                    color: 'auto'
                },
                data: [
                    {
                        value: 0,
                        name: "MB",
                    }
                ]
            },
        ]
    };

    var chart_swap_gauge = echarts.init(document.getElementById('swap_gauge'));
    var option_swap_gauge = {
        series: [
            {
                type: 'gauge',
                center: ['50%', '80%'],
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 128,
                splitNumber: 8,
                itemStyle: {
                    color: '#FFAB91'
                },
                progress: {
                    show: true,
                    width: 12
                },
                pointer: {
                    show: true,
                    
                    icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                    length: '62%',
                    width: 4,
                    offsetCenter: [0, '-60%'],
                    itemStyle: {
                        color: 'auto'
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: 16,
                        color: [
                            [0.75, '#E4984E'],
                            [1, '#E12A52']
                        ]
                    }
                },
                axisTick: {
                    distance: -45,
                    splitNumber: 2,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                splitLine: {
                    distance: -52,
                    length: 14,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                axisLabel: {
                    distance: -65,
                    color: '#ffffff',
                    fontSize: 0
                },
                anchor: {
                    show: false
                },
                title: {
                    offsetCenter: [0, '-20%'],
                    fontSize: 12,
                    color: "#808080"

                },
                detail: {
                    valueAnimation: true,
                    width: '60%',
                    lineHeight: 16,
                    borderRadius: 8,
                    offsetCenter: [0, '-45%'],
                    fontSize: 12,
                    fontWeight: 'bolder',
                    formatter: '{value}',
                    color: 'auto'
                },
                data: [
                    {
                        value: 0,
                        name: "MB",
                    }
                ]
            },
        ]
    };

    var chart_disk_gauge = echarts.init(document.getElementById('disk_gauge'));
    var option_disk_gauge = {
        series: [
            {
                type: 'gauge',
                center: ['50%', '80%'],
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 32,
                splitNumber: 8,
                itemStyle: {
                    color: '#FFAB91'
                },
                progress: {
                    show: true,
                    width: 12
                },
                pointer: {
                    show: true,
                    
                    icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                    length: '62%',
                    width: 4,
                    offsetCenter: [0, '-60%'],
                    itemStyle: {
                        color: 'auto'
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: 16,
                        color: [
                            [0.75, '#E4984E'],
                            [1, '#E12A52']
                        ]
                    }
                },
                axisTick: {
                    distance: -45,
                    splitNumber: 2,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                splitLine: {
                    distance: -52,
                    length: 14,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                axisLabel: {
                    distance: -45,
                    color: '#ffffff',
                    fontSize: 0
                },
                anchor: {
                    show: false
                },
                title: {
                    offsetCenter: [0, '-20%'],
                    fontSize: 12,
                    color: "#808080"

                },
                detail: {
                    valueAnimation: true,
                    width: '60%',
                    lineHeight: 16,
                    borderRadius: 8,
                    offsetCenter: [0, '-45%'],
                    fontSize: 12,
                    fontWeight: 'bolder',
                    formatter: '{value}',
                    color: 'auto'
                },
                data: [
                    {
                        value: 0,
                        name: "GB",
                    }
                ]
            },
        ]
    };


    option_cpu_gauge && chart_cpu_gauge.setOption(option_cpu_gauge);
    option_mem_gauge && chart_mem_gauge.setOption(option_mem_gauge);
    option_cache_gauge && chart_cache_gauge.setOption(option_cache_gauge);
    option_swap_gauge && chart_swap_gauge.setOption(option_swap_gauge);
    option_disk_gauge && chart_disk_gauge.setOption(option_disk_gauge);

    function get_server_info(){
        $.ajax({
            url: app_root + "/data/server_status_info",
            dataType: "json",
            type: "get",

        }).done(function (msg) {
            console.log(msg);
            if (msg.state == "ok") {
                $("#inner_ip").text(msg.msg.inner_ip);
                $("#outer_ip").text(msg.msg.outer_ip);
                $("#open_time").text(msg.msg.open_time);
                $("#user_name").text(msg.msg.user_name);
                $("#system").text(msg.msg.system);
                $("#node").text(msg.msg.node_name);
                $("#machine").text(msg.msg.machine);
            }
        })
    }
    // get_server_info()

    function get_server_status(){
        $.ajax({
            url: app_root + "/data/server_status_data",
            type:"get",
            dataType:"json",
        }).done(function(msg){
            if(msg.state=="ok"){
                console.log(msg.msg);
                // CPU数据
                $("#MHz").text(msg.msg.cpu.cpu_freq);
                $("#CORE").text(msg.msg.cpu.core);
                $("#temp").text(msg.msg.cpu.temp);
                $("#IDEL").text(msg.msg.cpu.idle+"%");
                $("#USER").text(msg.msg.cpu.user+"%");
                $("#SYS").text(msg.msg.cpu.system+"%");
                $("#NICE").text(msg.msg.cpu.nice+"%");
                $("#IOW").text(msg.msg.cpu.iowait+"%");
                $("#IRQ").text(msg.msg.cpu.irq+"%");
                $("#SIRQ").text(msg.msg.cpu.softirq+"%");
                $("#platform").text(msg.msg.cpu.platform);
                option_cpu_gauge.series[0].data[0].value = msg.msg.cpu.cpu_percent;
                option_cpu_gauge && chart_cpu_gauge.setOption(option_cpu_gauge);
                // 内存数据
                $("#USED").text(parseInt(msg.msg.mem.used/(1024*1024)) + " MB");
                $("#CACHED").text(parseInt(msg.msg.mem.cached/(1024*1024)) + " MB");
                $("#FREE").text(parseInt(msg.msg.mem.free/(1024*1024)) + " MB");
                $("#SWAP").text(parseInt(msg.msg.mem.swap/(1024*1024)) + " MB");
                $("#RUNNING").text(msg.msg.mem.running);
                option_mem_gauge.series[0].data[0].value = msg.msg.mem.mem_percent;
                option_mem_gauge && chart_mem_gauge.setOption(option_mem_gauge);
                // cache数据
                option_cache_gauge.series[0].max = parseInt((msg.msg.mem.total)/(1024*1024));
                option_cache_gauge.series[0].data[0].value = parseInt((msg.msg.mem.cached+msg.msg.mem.buffers)/(1024*1024));
                $("#cache_used").text(parseInt(msg.msg.mem.cached/(1024*1024))+" MB");
                $("#cache_buffers").text(parseInt(msg.msg.mem.buffers/(1024*1024))+" MB");
                option_cache_gauge && chart_cache_gauge.setOption(option_cache_gauge);
                // swap数据
                option_swap_gauge.series[0].max = parseInt((msg.msg.mem.swap_total)/(1024*1024));
                option_swap_gauge.series[0].data[0].value = parseInt((msg.msg.mem.swap_used)/(1024*1024));
                $("#swap_used").text(parseInt(msg.msg.mem.swap_percent)+" %");
                $("#swap_free").text(parseInt((msg.msg.mem.swap_total-msg.msg.mem.swap_used)/(1024*1024))+" MB");
                option_swap_gauge && chart_swap_gauge.setOption(option_swap_gauge);
                // 硬盘数据
                option_disk_gauge.series[0].max = parseInt((msg.msg.dict.total)/(1024*1024*1024));
                option_disk_gauge.series[0].data[0].value = parseInt((msg.msg.dict.used)/(1024*1024*1024));
                $("#disk_used").text(parseInt(msg.msg.dict.percent)+" %");
                $("#disk_free").text(parseInt(msg.msg.dict.free/(1024*1024*1024))+" GB");
                option_disk_gauge && chart_disk_gauge.setOption(option_disk_gauge);
                // 网络数据
                var sent = msg.msg.net.sent;
                var recv = msg.msg.net.recv;
                if((sent/1024)<1000){
                    $("#up_speed").text(parseInt(sent/1024) + "KB/s");
                }else{
                    $("#up_speed").text(parseInt(sent/(1024*1024)) + "MB/s");
                }
                if((recv/1024)<1000){
                    $("#down_speed").text(parseInt(recv/1024) + "KB/s");
                }else{
                    $("#down_speed").text(parseInt(recv/(1024*1024)) + "MB/s");
                }
            }
        })
    }
    get_server_status()
    setInterval(get_server_status, 5000);
})


