var WinGame;
(function (WinGame) {
    /*
    *  Main class of the game view
    */
    var GameView = (function () {
        function GameView() {
            var _this = this;
            this._typeOfWins = ["NO WIN", "SMALL WIN", "BIG WIN"];
            if (GameView._instance) {
                throw Error("An instance of the game view was already instatiated");
                return;
            }
            GameView._instance = this;
            // EVENTS
            WinGame.eventManager.Register("sendSpinRequest", function () {
                _this._buttonSpin.setDisabled(true);
                _this._winText.setVisible = false;
                _this._bonus.setVisible = false;
            });
            WinGame.eventManager.Register("sendSpinRequest", function () {
                _this.ClearSymbols();
            });
            WinGame.eventManager.Register("gameClosed", function () {
                _this._buttonSpin.setDisabled(false);
                _this._bonus.setVisible = false;
            });
        }
        /*
        *   Initialise the main game view
        */
        GameView.prototype.Init = function () {
            this.CreateSpinButton();
            this.CreateSymbolsAreas();
            this.CreateWinText();
            this.CreateBonusNotification();
        };
        /*
       *   Creates the Spin button
       */
        GameView.prototype.CreateSpinButton = function () {
            this._buttonSpin = WinGame.game.Renderer.CreateBitmapButton("spinBtn", ((WinGame.properties.width - 98) * 0.5), WinGame.properties.height - 150, 98, 98, WinGame.game.AssetLoader.GetSrcForAssetId("button"), function () { WinGame.eventManager.Publish("spin"); });
        };
        /*
       *   Creates the areas for the symbols
       */
        GameView.prototype.CreateSymbolsAreas = function () {
            var areaWidth = (WinGame.properties.width - 120) / 3;
            this._symbolArea1 = WinGame.game.Renderer.CreateColorBox("symbolArea1", 50, 190, areaWidth, 200, [175, 192, 209]);
            this._symbolArea2 = WinGame.game.Renderer.CreateColorBox("symbolArea2", 50 + areaWidth + 10, 190, areaWidth, 200, [175, 192, 209]);
            this._symbolArea3 = WinGame.game.Renderer.CreateColorBox("symbolArea3", 50 + ((areaWidth + 10) * 2), 190, areaWidth, 200, [175, 192, 209]);
        };
        /*
       *  Creates the win text
       */
        GameView.prototype.CreateWinText = function () {
            this._winText = WinGame.game.Renderer.CreateText("winText", (WinGame.properties.width - 350) * 0.5, 100, 350, 50, ["", "95", "Arial"], this._typeOfWins[0], [185, 0, 25]);
            this._winText.setAlpha = 1;
            this._winText.setVisible = false;
        };
        /*
       *   Creates the bonus notification
       */
        GameView.prototype.CreateBonusNotification = function () {
            this._bonus = WinGame.game.Renderer.CreateBitmap("bonus", 700, 400, 200, 134, WinGame.game.AssetLoader.GetSrcForAssetId("bonus"));
            this._bonus.setVisible = false;
        };
        /*
        *   Starts displaying the new symbols with a delay between them
        *   At the end publish the event for the end of the game
        */
        GameView.prototype.ShowNewSymbols = function () {
            var _this = this;
            setTimeout(function () { _this.AddAndAnimateSymbol(1, _this.GetSymbolIdForSymbolIndex(WinGame.responseModel.symbols[0])); }, 500);
            setTimeout(function () { _this.AddAndAnimateSymbol(2, _this.GetSymbolIdForSymbolIndex(WinGame.responseModel.symbols[1])); }, 1000);
            setTimeout(function () { _this.AddAndAnimateSymbol(3, _this.GetSymbolIdForSymbolIndex(WinGame.responseModel.symbols[2])); }, 1500);
            setTimeout(function () { _this.ShowWinning(); }, 2000);
            setTimeout(function () { WinGame.eventManager.Publish("endGame"); }, 3000);
        };
        /*
       *   Shows the Bonus notification
       */
        GameView.prototype.ShowBonus = function () {
            // Bonus Sound
            WinGame.eventManager.Publish("bonusSound");
            this._bonus.setVisible = true;
        };
        /*
       *   Returns the symbol id for a symbol index
       *   I gave a special id for the wild symbol, however in this example would be needed
       *   @param {String} index index of the symbol
       */
        GameView.prototype.GetSymbolIdForSymbolIndex = function (index) {
            switch (index) {
                case "0":
                    {
                        return "SymbolWild";
                    }
                    break;
                default:
                    {
                        return "Symbol" + index;
                    }
                    break;
            }
        };
        /*
        *   Shows the winning depening of the win type
        */
        GameView.prototype.ShowWinning = function () {
            // Sound of the win
            WinGame.eventManager.Publish("winSound");
            switch (WinGame.responseModel.typeWin) {
                case 1:
                    {
                        this._winText.setText = this._typeOfWins[0];
                    }
                    break;
                case 2:
                    {
                        this._winText.setText = this._typeOfWins[1];
                    }
                    break;
                case 3:
                    {
                        this._winText.setText = this._typeOfWins[2];
                    }
                    break;
            }
            this._winText.setVisible = true;
        };
        /*
        *   Fade In animation for the new symbol
        *   @param {number} area index of the symbol area
        *   @param {string} symbol index of the symbol
        */
        GameView.prototype.AddAndAnimateSymbol = function (area, symbol) {
            // Play sound
            WinGame.eventManager.Publish("symbolAppear");
            var symbolImg = this.AddSymbolToArea(area, symbol);
            symbolImg.setAlpha = 0;
            var alpha = 0;
            function FadeIn() {
                alpha += 0.01;
                if (alpha > 1) {
                    symbolImg.setAlpha = 1;
                    return;
                }
                symbolImg.setAlpha = alpha;
                requestAnimationFrame(FadeIn);
            }
            requestAnimationFrame(FadeIn);
        };
        /*
        *   Adds a symbol to an area
        *   @param {number} area index of the symbol area
        *   @param {string} symbol index of the symbol
        */
        GameView.prototype.AddSymbolToArea = function (area, symbol) {
            //var newSymbol = game.Renderer.CreateBitmap("sym
            var areax, areay, areaw, areah;
            switch (area) {
                case 1:
                    {
                        areax = this._symbolArea1.getPosition.x;
                        areay = this._symbolArea1.getPosition.y;
                        areaw = this._symbolArea1.getWidth;
                        areah = this._symbolArea1.getHeight;
                        this._symbol1 = WinGame.game.Renderer.CreateBitmap("symbol1", areax + (areaw - WinGame.symbolData.width) * 0.5, areay + (areah - WinGame.symbolData.height) * 0.5, WinGame.symbolData.width, WinGame.symbolData.height, WinGame.game.AssetLoader.GetSrcForAssetId(symbol));
                        return this._symbol1;
                    }
                    break;
                case 2:
                    {
                        areax = this._symbolArea2.getPosition.x;
                        areay = this._symbolArea2.getPosition.y;
                        areaw = this._symbolArea2.getWidth;
                        areah = this._symbolArea2.getHeight;
                        this._symbol2 = WinGame.game.Renderer.CreateBitmap("symbol2", areax + (areaw - WinGame.symbolData.width) * 0.5, areay + (areah - WinGame.symbolData.height) * 0.5, WinGame.symbolData.width, WinGame.symbolData.height, WinGame.game.AssetLoader.GetSrcForAssetId(symbol));
                        return this._symbol2;
                    }
                    break;
                case 3:
                    {
                        areax = this._symbolArea3.getPosition.x;
                        areay = this._symbolArea3.getPosition.y;
                        areaw = this._symbolArea3.getWidth;
                        areah = this._symbolArea3.getHeight;
                        this._symbol3 = WinGame.game.Renderer.CreateBitmap("symbol3", areax + (areaw - WinGame.symbolData.width) * 0.5, areay + (areah - WinGame.symbolData.height) * 0.5, WinGame.symbolData.width, WinGame.symbolData.height, WinGame.game.AssetLoader.GetSrcForAssetId(symbol));
                        return this._symbol3;
                    }
                    break;
                default: {
                    throw Error("There is no symbol area for aera number : " + area);
                }
            }
        };
        /*
        *   Removes all the symbols
        */
        GameView.prototype.ClearSymbols = function () {
            if (this._symbol1) {
                WinGame.game.Renderer.RemoveObject(this._symbol1.Id);
                this._symbol1 = null;
            }
            if (this._symbol2) {
                WinGame.game.Renderer.RemoveObject(this._symbol2.Id);
                this._symbol2 = null;
            }
            if (this._symbol3) {
                WinGame.game.Renderer.RemoveObject(this._symbol3.Id);
                this._symbol3 = null;
            }
        };
        return GameView;
    })();
    WinGame.GameView = GameView;
})(WinGame || (WinGame = {}));
//# sourceMappingURL=gameview.js.map