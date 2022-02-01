function getCookie(name) {
    $.ajax({
        url: app_root + "/csrf_token",
        type: "get",
        dataType: "json",
        async: true,
    }).done(function (msg) {
        console.log(msg);
    })
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want? 
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection 
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
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
        if (kw[0] === 'csrftoken') {
            // alert(csrf_token);
            return kw[1];  //返回
        }
    }
}

$.ajaxSetup({
    // crossDomain: false, // obviates need for sameOrigin test 
    crossDomain: true,
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});