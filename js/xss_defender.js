function xss_defender(str_row) {
    var new_div = document.createElement("div");
    new_div.innerHTML = str_row;
    var content = new_div.innerText;
    return str_row;
}