var socket, interval, interval2, lastUpdateTime
var comment_buffer = new Array()
var k = "QUl6YVN5Qm1IX1ZuZnZ5YzBxVlhVTGVKSzVzZVJGaUFNQnVfQTZB"

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
})

function connectYoutube() {
    let videoUrl = $("#video_url").val()
    let videoId = videoUrl.match(/https:\/\/(youtu\.be\/|www\.youtube\.com\/watch\?v=)([\w\-]+)(&.+)*/)[2]
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/videos',
        type: 'GET',
        data: {
            part: 'liveStreamingDetails',
            id: videoId,
            key: atob(k)
        }
    }).done((data) => {
        $("#connect_button").toggleClass("disabled")
        $("#disconnect_button").toggleClass("disabled")
        $("#video_url").attr("disabled", true)
        $("#howto").slideUp()
        if (window.innerWidth < 600) $('.collapsible').collapsible('close', 0)
        let activeChatId = (data).items[0].liveStreamingDetails.activeLiveChatId
        if (activeChatId != null) {
            lastUpdateTime = new Date().getTime()
            getComment(activeChatId)
            interval = setInterval(() => {
                getComment(activeChatId)
            }, 10000)
        }
    })
}

function getComment(activeChatId){
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/liveChat/messages',
        type: 'GET',
        data: {
            liveChatId: activeChatId,
            part: 'authorDetails,snippet',
            hl: 'ja',
            maxResults: 2000,
            key: atob(k)
        }
    }).done((data) => {
        let mode = $("#mode").val()
        for (item of data.items) {
            let UpdateTime = new Date(item.snippet.publishedAt).getTime()
            if (lastUpdateTime < UpdateTime) {
                console.log(item)
                let author = (String)(item.authorDetails.displayName)
                let card, message
                if (item.snippet["textMessageDetails"]) {
                    message = (String)(item.snippet.textMessageDetails.messageText)
                    card = `<div class="col s12 message-panel"><div class="card-panel"><H6>${author}</H6><span>${message}</span></div></div>`
                } else {
                    message = (String)(item.snippet.displayMessage)
                    card = `<div class="col s12 superchat-panel"><div class="card-panel orange lighten-4 pulse"><H6>${author}</H6><span>${message}</span></div></div>`
                }
                $(card).prependTo("#comment_box").hide().slideDown(300)
                if (mode == 0) sayBouyomi(message)
                else if (mode == 1) sayWebspeech(message)
                if (item == data.items[data.items.length - 1]) lastUpdateTime = UpdateTime
            }
        }
    })
}


function disconnectYoutube() {
    clearInterval(interval)
    speechSynthesis.cancel();
    $("#connect_button").toggleClass("disabled")
    $("#disconnect_button").toggleClass("disabled")
    $("#video_url").attr("disabled", false)
    setTimeout(() => { $("#comment_box").fadeOut(500).empty().fadeIn(500) }, 500)
}
