var socket, mode;
var color = {
    '#1E88E5': "light-blue accent-3",
    '#00E5FF': "cyan accent-2",
    '#1DE9B6': "teal accent-3",
    '#FFCA28': "yellow accent-2",
    '#F57C00': "orange accent-3",
    '#E91E63': "pink darken-1",
    '#E62117': "red darken-1"
}

$(document).ready(function () {
    var ua = navigator.userAgent
    $('.sidenav').sidenav()
    $('.collapsible').collapsible()
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
        console.log("mobile")
        $("#select_bouyomi").attr("disabled", true)
        $("#select_sapi").attr("selected", true)
        $("#readskip").slideDown(150);
    }
    $('select').formSelect()
    socket = io('https://api.advbear.net/');
    socket.on('comment', (item) => {
        let author = (String)(item.author.name)
        let message = generateText(item.message)
        if (!item.superchat) {
            card = `<div class="col s12 message-panel" onclick="sayWebspeech(this)"><div class="card-panel"><H6>${author}</H6><span>${message[0]}</span></div></div>`
        } else {
            amount = (String)(item.superchat.amount)
            card = `<div class="col s12 message-panel" onclick="sayWebspeech(this)"><div class="card-panel ${color[item.superchat.color]} pulse"><H6>${author} - <b>${amount}</b></H6><span>${message[0]}</span></div></div>`
        }
        let obj = $(card).prependTo("#comment_box").hide().slideDown(300)
        if($('.message-panel').length > 100) $('.message-panel:last').slideUp(300).remove()
        if (mode == 0) sayBouyomi(message[1])
        else if (mode == 1) {
            speechList.push(obj)
        }
    });
})

function generateText(message) {
    let html = "";
    let text = "";
    for (msg of message) {
        if ('url' in msg) {
            html += `<img src="${msg.url}" style="height: 1em">`;
        }
        if ('text' in msg) {
            html += msg.text
            text += msg.text;
        }
    }
    return [html, text];
}

function connectYoutube() {
    mode = $("#mode").val()
    let videoUrl = $("#video_url").val()
    if (videoUrl.match(/https:\/\/(youtu\.be\/|www\.youtube\.com\/watch\?v=)([\w\-]+)(&.+)*/)) {
        let videoId = videoUrl.match(/https:\/\/(youtu\.be\/|www\.youtube\.com\/watch\?v=)([\w\-]+)(&.+)*/)[2]
        console.log(videoId)
        socket.emit('begin', videoId);
        $("#connect_button").toggleClass("disabled")
        $("#disconnect_button").toggleClass("disabled")
        $("#video_url").attr("disabled", true)
        sayWebspeech($("<p><span>読み上げを開始します</span><p>"))
    } else {
        alert("YouTube LiveのURLを入力してください")
    }
}

function disconnectYoutube() {
    socket.close()
    socket.open()
    speechSynthesis.cancel();
    $("#connect_button").toggleClass("disabled")
    $("#disconnect_button").toggleClass("disabled")
    $("#video_url").attr("disabled", false)
    setTimeout(() => { $("#comment_box").fadeOut(500).empty().fadeIn(500) }, 500)
}
