var WinGame;
(function (WinGame) {
    /*
    *  Asset Loader
    */
    var AssetLoader = (function () {
        function AssetLoader() {
            this._assetsLoaded = 0;
            if (AssetLoader._instance) {
                throw Error("An instance of the asset loader was already instatiated");
                return;
            }
            AssetLoader._instance = this;
            // EVENTS
            var _this = this;
            WinGame.eventManager.Register("assetsLoaded", _this.EndLoading.bind(_this));
        }
        /*
        *   Initialise the loader and display the loading screen
        */
        AssetLoader.prototype.InitLoader = function () {
            this.ShowLoadingScreen();
            this.InitLoadingQueue();
        };
        /*
        *   Shows the loading screen with the logo and loading bar
        */
        AssetLoader.prototype.ShowLoadingScreen = function () {
            this._logo = WinGame.game.Renderer.CreateBitmap("gameLogo", ((WinGame.properties.width - 512) * 0.5), 100, 512, 256, this.GetSrcForAssetId("logo"));
            this._loadingBarBackground = WinGame.game.Renderer.CreateColorBox("loadingBarBackground", ((WinGame.properties.width - 800) * 0.5), WinGame.properties.height - 100, 800, 35, [128, 253, 192]);
            this._loadingBar = WinGame.game.Renderer.CreateColorBox("loadingBar", ((WinGame.properties.width - 795) * 0.5), WinGame.properties.height - 97.5, 1, 30, [45, 200, 90]);
        };
        /*
        *   Starts loading the assets
        */
        AssetLoader.prototype.InitLoadingQueue = function () {
            var i;
            for (i = 0; i < WinGame.assetsList.length; ++i) {
                if (WinGame.assetsList[i].type === "img") {
                    this.LoadImage(WinGame.assetsList[i].src);
                }
                else if (WinGame.assetsList[i].type === "snd") {
                    this.LoadSound(WinGame.assetsList[i].src);
                }
            }
        };
        /*
        *   Loads an asset of an image type
        *   @param {String} scr Source of the asset
        */
        AssetLoader.prototype.LoadImage = function (src) {
            var img = new Image();
            img.onload = this.AssetLoaded.bind(this);
            img.src = src;
        };
        /*
        *   Loads an asset of an audio type
        *   @param {String} scr Source of the asset
        */
        AssetLoader.prototype.LoadSound = function (src) {
            var snd = new Audio();
            snd.addEventListener("loadeddata", this.AssetLoaded.bind(this));
            snd.src = src;
        };
        /*
        *   Callback when the asset is loaded
        *   Updates the loading bar
        */
        AssetLoader.prototype.AssetLoaded = function () {
            this._assetsLoaded++;
            this.UpdateLoadingBar();
            if (this._assetsLoaded === WinGame.assetsList.length) {
                WinGame.eventManager.Publish("assetsLoaded");
            }
        };
        /*
        *   Updates the loading bar
        */
        AssetLoader.prototype.UpdateLoadingBar = function () {
            var pctg = this._assetsLoaded / WinGame.assetsList.length;
            this._loadingBar.setWidth = 795 * pctg;
        };
        /*
        *   Returns the source of an asset identify by its id
        *   @param {string} id ID of the asset
        *   @return {string} source of the asset
        */
        AssetLoader.prototype.GetSrcForAssetId = function (id) {
            var i;
            for (i = 0; i < WinGame.assetsList.length; ++i) {
                if (WinGame.assetsList[i].id === id) {
                    return WinGame.assetsList[i].src;
                }
            }
            console.warn("Not asset found for id : " + id);
            return "";
        };
        /*
        *   When all assets have been preloaded the loading view fades out
        */
        AssetLoader.prototype.EndLoading = function () {
            var alpha = 1, _this = this;
            var fadeout = function () {
                alpha -= 0.01;
                if (alpha < 0) {
                    WinGame.game.Renderer.RemoveObject(_this._logo.Id);
                    WinGame.game.Renderer.RemoveObject(_this._loadingBarBackground.Id);
                    WinGame.game.Renderer.RemoveObject(_this._loadingBar.Id);
                    _this._logo = null;
                    _this._loadingBarBackground = null;
                    _this._loadingBar = null;
                    // Publish the event to start the game
                    WinGame.eventManager.Publish("startGame");
                    return;
                }
                _this._logo.setAlpha = alpha;
                _this._loadingBarBackground.setAlpha = alpha;
                _this._loadingBar.setAlpha = alpha;
                requestAnimationFrame(fadeout);
            };
            requestAnimationFrame(fadeout);
        };
        return AssetLoader;
    })();
    WinGame.AssetLoader = AssetLoader;
})(WinGame || (WinGame = {}));
//# sourceMappingURL=assetsLoader.js.map