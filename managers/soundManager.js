/*
*   Global namespace for the project
*/
var WinGame;
(function (WinGame) {
    /*
    *  Main class of the Sound Manager
    */
    var SoundManager = (function () {
        function SoundManager() {
            var _this = this;
            if (SoundManager._instance) {
                throw Error("An instance of the sound manager was already instatiated");
                return;
            }
            SoundManager._instance = this;
            // EVENTS 
            WinGame.eventManager.Register("startGame", function () {
                _this.LoadSounds();
                _this.LoadAndStartBackgroundMusic();
            });
            WinGame.eventManager.Register("symbolAppear", function () {
                var symbol = new Audio();
                symbol.src = WinGame.game.AssetLoader.GetSrcForAssetId("symbolsnd");
                symbol.play();
            });
            WinGame.eventManager.Register("winSound", function () { _this.Playwin(); });
            WinGame.eventManager.Register("bonusSound", function () { _this._bonus.play(); });
        }
        /*
        *   Plays the win sound depending on the win type
        */
        SoundManager.prototype.Playwin = function () {
            if (WinGame.responseModel.typeWin === 2) {
                this._smallWin.play();
            }
            else if (WinGame.responseModel.typeWin === 3) {
                this._bigWin.play();
            }
        };
        /*
        *   Loads sounds for the wins and bonus
        */
        SoundManager.prototype.LoadSounds = function () {
            this._smallWin = new Audio();
            this._smallWin.src = WinGame.game.AssetLoader.GetSrcForAssetId("smallwin");
            this._bigWin = new Audio();
            this._bigWin.src = WinGame.game.AssetLoader.GetSrcForAssetId("bigwin");
            this._bonus = new Audio();
            this._bonus.src = WinGame.game.AssetLoader.GetSrcForAssetId("bonussnd");
        };
        /*
        *   Loads and starts the background music
        *   On mobile devices waits for the first touch event to start the music
        */
        SoundManager.prototype.LoadAndStartBackgroundMusic = function () {
            var _this = this;
            this._bgMusic = new Audio();
            this._bgMusic.addEventListener("loadeddata", function () {
                if (!WinGame.properties.isMobile) {
                    _this._bgMusic.play();
                }
                else {
                    function StartBgMusic() {
                        this._bgMusic.play();
                        window.removeEventListener("touchstart", StartBgMusic.bind(this));
                    }
                    window.addEventListener("touchstart", StartBgMusic.bind(_this));
                }
            });
            // Looping the music
            this._bgMusic.addEventListener("ended", function () {
                _this._bgMusic.currentTime = 0;
                _this._bgMusic.play();
            }, true);
            this._bgMusic.src = WinGame.game.AssetLoader.GetSrcForAssetId("musicbg");
        };
        return SoundManager;
    })();
    WinGame.SoundManager = SoundManager;
})(WinGame || (WinGame = {}));
//# sourceMappingURL=soundManager.js.map