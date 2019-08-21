var uttr = new SpeechSynthesisUtterance();

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
    uttr.text = text;
    uttr.lang = isEnglish(text) ?  uttr.lang = 'en-US' :  uttr.lang = 'ja-JP'
    speechSynthesis.speak(uttr);
}