$(document).ready(function () {
    if (!localStorage["accept_privacy_policy"]) {
        let modal=`
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
            onCloseEnd: ()=>{localStorage["accept_privacy_policy"] = true}
        });
        $('.modal').modal('open')
    }
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register("/StreamTTS/serviceWorker.js")
        .then(function(registration) {
          console.log("serviceWorker registed.")
        }).catch(function(error) {
          console.warn("serviceWorker error.", error)
        })
    }
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

function sayWebspeech(text) {
        //speechSynthesis.cancel();
        let uttr = new SpeechSynthesisUtterance();
        uttr.text = text;
        uttr.lang = isEnglish(text) ? uttr.lang = 'en-US' : uttr.lang = 'ja-JP'
        speechSynthesis.speak(uttr);
    }