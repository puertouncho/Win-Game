var WinGame;
(function (WinGame) {
    function isMobile() {
        if (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
            navigator.userAgent.match(/Opera Mini/i) ||
            navigator.userAgent.match(/IEMobile/i)) {
            return true;
        }
        return false;
    }
    WinGame.properties = {
        width: 1024,
        height: 565,
        isMobile: isMobile()
    };
    WinGame.assetsList = [
        // images
        { id: "logo", src: "img/logo.png", type: "img" },
        { id: "musicbg", src: "snd/backgroundMusic.mp3", type: "snd" },
        { id: "symbolsnd", src: "snd/symbol.mp3", type: "snd" },
        { id: "smallwin", src: "snd/smallwin.mp3", type: "snd" },
        { id: "bigwin", src: "snd/bigwin.mp3", type: "snd" },
        { id: "bonussnd", src: "snd/bonus.mp3", type: "snd" },
        { id: "SymbolWild", src: "img/Symbol_0.png", type: "img" },
        { id: "Symbol1", src: "img/Symbol_1.png", type: "img" },
        { id: "Symbol2", src: "img/Symbol_2.png", type: "img" },
        { id: "Symbol3", src: "img/Symbol_3.png", type: "img" },
        { id: "Symbol4", src: "img/Symbol_4.png", type: "img" },
        { id: "button", src: "img/button.png", type: "img" },
        { id: "bonus", src: "img/freespinbonus.png", type: "img" }
    ];
    WinGame.symbolData = {
        width: 235,
        height: 155
    };
})(WinGame || (WinGame = {}));
//# sourceMappingURL=properties.js.map