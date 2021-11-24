var socket, mode;
var color = {
    4280191205: "light-blue accent-3",
    4278248959: "cyan accent-2",
    4280150454: "teal accent-3",
    4294953512: "yellow accent-2",
    4294278144: "orange accent-3",
    4293467747: "pink darken-1",
    4293271831: "red darken-1"
}

$(document).ready(function () {
    var ua = navigator.userAgent
    $('.sidenav').sidenav()
    $('.collapsible').collapsible()
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
        console.log("mobile")
        $("#select_bouyomi").attr("disabled", true)
        $("#select_sapi").attr("selected", true)
    }
    $('select').formSelect()
    socket = io('https://api.advbear.net/');
    socket.on('comment', (item) => {
        let author = (String)(item.author.name)
        let message = generateText(item.message)
        if (!item.superchat) {
            card = `<div class="col s12 message-panel"><div class="card-panel"><H6>${author}</H6><span>${message[0]}</span></div></div>`
        } else {
            amount = (String)(item.superchat.amount)
            card = `<div class="col s12 message-panel"><div class="card-panel ${color[item.superchat.color]} pulse"><H6>${author} - <b>${amount}</b></H6><span>${message[0]}</span></div></div>`
        }
        $(card).prependTo("#comment_box").hide().slideDown(300)
        if($('.message-panel').length > 100) $('.message-panel:last').slideUp(300).remove()
        if (mode == 0) sayBouyomi(message[1])
        else if (mode == 1) speechList.push(message[1])
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
