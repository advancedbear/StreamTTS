var socket, channel

$(document).ready(function () {
    var ua = navigator.userAgent;
    $('.sidenav').sidenav();
    $('.collapsible').collapsible();
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
        console.log("mobile")
        $("#select_bouyomi").attr("disabled", true)
        $("#select_sapi").attr("selected", true)
        $("#readskip").slideDown(150);
    }
    $('select').formSelect();
    $('.modal').modal({
        dismissible: false
    });
    $('.modal').modal('open');
});

function connectMixer() {
    channel = $("#channel_name").val()
    $.ajax({
        url: `https://mixer.com/api/v1/channels/${channel}`,
        type: 'GET',
        data: {
            fields: 'id'
        }
    }).done((data) => {
        $("#connect_button").toggleClass("disabled")
        $("#disconnect_button").toggleClass("disabled")
        $("#channel_name").attr("disabled", true)
        $("#howto").slideUp()
        if(window.innerWidth < 600) $('.collapsible').collapsible('close', 0);
        let id = data.id
        if (id != null) {
            socket = new WebSocket("wss://chat.mixer.com:443")
            socket.addEventListener('open', (event) => {
                auth = {
                    id: 0,
                    type: "method",
                    method: "auth",
                    arguments: [id]
                }
                socket.send(JSON.stringify(auth))
            })
            socket.addEventListener("message", (event) => {
                setTimeout(() => {
                    let data = JSON.parse(event.data)
                    console.log(data)
                    if (data.event == "ChatMessage") {
                        let mode = $("#mode").val()
                        for (message of data.data.message.message) {
                            let card = `<div class="col s12"><div class="card-panel"><H6>${data.data.user_name}</H6><span>${message.text}</span></div></div>`
                            $(card).prependTo("#comment_box").hide().slideDown(300)
                            if (mode == 0) sayBouyomi(message.text)
                            else if (mode == 1) speechList.push(message.text)
                        }
                    }
                }, 200)
            })
        }
    })
}

function disconnectMixer() {
    socket.close()
    $("#connect_button").toggleClass("disabled")
    $("#disconnect_button").toggleClass("disabled")
    $("#channel_name").attr("disabled", false)
    setTimeout(() => { $("#comment_box").fadeOut(500).empty().fadeIn(500) }, 500)
}
