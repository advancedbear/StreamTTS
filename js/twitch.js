var socket, channel

$(document).ready(function () {
    var ua = navigator.userAgent;
    $('.sidenav').sidenav();
    $('.collapsible').collapsible();
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        console.log("mobile")
        $("#select_bouyomi").attr("disabled", true)
        $("#select_sapi").attr("selected", true)
    }
    $('select').formSelect();
});

function connectTwitch() {
    channel = $("#channel_name").val()
    if(channel.indexOf("https://") != -1) channel = channel.replace(/https?:\/\/www\.twitch\.tv\/(.*?)\/?.*/,"$1")
    if (channel != null) {
        socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443")
        socket.addEventListener("open", (event) => {
            socket.send("NICK justinfan184")
            socket.send(`JOIN #${channel}`)
        })
        socket.addEventListener("message", (event) => {
            setTimeout(() => {
                let msg = event.data
                let mode = $("#mode").val()
                if (msg.indexOf("PRIVMSG") != -1) {
                    let privmsg = msg.replace(/(\x01ACTION|\x01)/g,"").match(/:(.+)!(.+)@(.+)\.tmi\.twitch\.tv PRIVMSG #(.+) :(.+)/)
                    let card = `<div class="col s12 message-panel" onclick="sayWebspeech(this)"><div class="card-panel"><H6>${privmsg[1]}</H6><span>${privmsg[5]}</span></div></div>`
                    let obj = $(card).prependTo("#comment_box").hide().slideDown(300)
                    if($('.message-panel').length > 100) $('.message-panel:last').slideUp(300).remove()
                    if(mode == 0) sayBouyomi(privmsg[5])
                    else if(mode == 1) speechList.push(obj)
                } else if (msg.indexOf("PING") != -1) {
                    socket.send("PONG :tmi.twitch.tv")
                } else if (msg.indexOf("JOIN") != -1 ){
                    $("#connect_button").toggleClass("disabled")
                    $("#disconnect_button").toggleClass("disabled")
                    $("#channel_name").attr("disabled", true)
                    $("#howto").slideUp()
                    if(window.innerWidth < 600) $('.collapsible').collapsible('close', 0);
                }
            }, 200)
        })
        sayWebspeech($("<p><span>読み上げを開始します</span><p>"))
    }
}

function disconnectTwitch(){
    socket.send(`PART #${channel}`)
    $("#connect_button").toggleClass("disabled")
    $("#disconnect_button").toggleClass("disabled")
    $("#channel_name").attr("disabled", false)
    setTimeout(()=>{$("#comment_box").fadeOut(500).empty().fadeIn(500)}, 500)
}