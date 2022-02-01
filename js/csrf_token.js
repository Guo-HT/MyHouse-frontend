var csrf_token = "";
if (get_csrf_token() === undefined) {
    console.log("无csrf-token", get_csrf_token());
    $.ajax({
        url: app_root + "/csrf_token",
        type: "get",
        dataType: "json",
        async: true,
    }).done(function (msg) {
        csrf_token = msg.token;
        document.cookie = 'csrftoken=' + csrf_token;  // token设置到cookie中
    })
}else{
    console.log("有csrf-token");
}

function get_csrf_token() {
    // 获取cookie
    var cookies = document.cookie;
    // 将cookie字符串切分成单个cookie数组
    var cookies_list = cookies.split(';')
    //cookie数量
    var cookie_num = cookies_list.length;
    //遍历
    for (var i = 0; i < cookie_num; i++) {
        var kw = cookies_list[i].split('=');
        //如果cookie的key为csrftoken
        if (kw[0].trim() === 'csrftoken') {
            // console.log(kw[0], kw[1]);
            return kw[1];  //返回
        }
    }
}
