var speechList = [];
console.log(typeof SpeechSynthesisUtterance);
var voices = speechSynthesis.getVoices();

$(document).ready(function () {
    if (!localStorage["accept_privacy_policy"]) {
        let modal = `
        <div id = "modal1" class="modal" >
        <div class="modal-content">
            <h4>プライバシーポリシーへの同意</h4>
            <p>当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。</p>
            <p>この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関して、詳しくは<a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank">ここをクリック</a>してください。</p>
        </div>
        <div class="modal-footer">
            <a href="#!" class="modal-close waves-effect waves-green btn">了承しました</a>
        </div>
        </div>
        `
        $("body").append(modal)
        $('.modal').modal({
            dismissible: false,
            onCloseEnd: () => { localStorage["accept_privacy_policy"] = true }
        });
        $('.modal').modal('open')
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register("/StreamTTS/serviceWorker.js")
            .then(function (registration) {
                console.log("serviceWorker registed.")
            }).catch(function (error) {
                console.warn("serviceWorker error.", error)
            })
    }

    voices = speechSynthesis.getVoices();
    for (idx in voices) {
        if(voices[idx].lang == 'ja-JP') {
            $('#voiceJP').append(`<option value="${idx}" ${voices[idx].name.indexOf("Online")<0 ? "" : "selected"}>${voices[idx].name}</option>`);
        } else {
            $('#voice').append(`<option value="${idx}" ${voices[idx].lang != "en-US" ? "" : "selected"}>${voices[idx].name}</option>`);
        }
    }

    $("#mode").change(() => {
        if ($("#mode").val() == 0) $("#sapi_opt").slideUp(150);
        else if ($("#mode").val() == 1) $("#sapi_opt").slideDown(150);
    })
})


function isEnglish(text) {
    return (text.match("^(.*[｡-ﾟ０-９ａ-ｚＡ-Ｚぁ-んァ-ヶ亜-黑一-龠々ー].*)*$")) ? false : true
}

function sayBouyomi(text) {
    $.ajax({
        url: "http://localhost:50080/talk",
        type: "GET",
        data: {
            text: text
        }
    })
}

function sayWebspeech(elem) {
    let text = $(elem).find('span').text()
    if ($("#skipCheck").val()) speechSynthesis.cancel();
    let uttr = new SpeechSynthesisUtterance();
    uttr.text = text;
    uttr.rate = speechList.length<30 ? 1.0 : (speechList.length + 1) / 20;
    uttr.lang = isEnglish(text) ? 'en-US' : 'ja-JP'
    uttr.voice = isEnglish(text) ? voices[$('#voice').val()] : voices[$('#voiceJP').val()] 
    window.speechSynthesis.speak(uttr);
}

setInterval(() => {
    if (speechList.length != 0) {
        speechList[0].click()
        //sayWebspeech(speechList[0])
        speechList = speechList.slice(Math.floor(speechList.length/10+1));
    }
}, 1000 / (speechList.length + 1) * 0.75)