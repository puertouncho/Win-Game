/*
*   Global namespace for the project
*/
var WinGame;
(function (WinGameWinGame) {
    /*
    *  Main class of the game
    */
    var Game = (function () {
        function Game() {
            if (Game._instance) {
                throw Error("An instance of the game was already instatiated");
                return;
            }
            Game._instance = this;
        }
        Object.defineProperty(Game.prototype, "Renderer", {
            get: function () {
                return this._renderer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "AssetLoader", {
            get: function () {
                return this._assetLoader;
            },
            enumerable: true,
            configurable: true
        });
        /*
        *   Inits the game and registart the main controller to
        *   some games events.
        *   Also Creates the Renderer, AssetLoader, NetworkManager and GameView
        *   Start the preloading of the assets
        */
        Game.prototype.Init = function () {
            this._renderer = new WinGame.Renderer();
            this._assetLoader = new WinGame.AssetLoader();
            this._networkManager = new WinGame.NetworkManager();
            this._gameView = new WinGame.GameView();
            this._assetLoader.InitLoader();
            // EVENTS
            var _this = this;
            WinGame.eventManager.Register("startGame", _this.StartGame.bind(_this));
            WinGame.eventManager.Register("responseParsed", _this.ResponseReceived.bind(_this));
            WinGame.eventManager.Register("spin", _this.Spin.bind(_this));
            WinGame.eventManager.Register("endGame", _this.CheckEndGame.bind(_this));
        };
        /*
        *  Starts the main game view
        */
        Game.prototype.StartGame = function () {
            this._gameView.Init();
        };
        /*
        *   Checks if the game state is in iddle and
        *   if it is publish the event to send the spin request
        */
        Game.prototype.Spin = function () {
            if ((WinGame.stateMachine.getState & WinGame.States.STATE_IDDLE) != 0) {
                WinGame.stateMachine.setState = WinGame.States.STATE_SPINNING;
                WinGame.eventManager.Publish("sendSpinRequest");
            }
        };
        /*
        *   When the responsed have been parse initialise the
        *   showing new symbols animation
        */
        Game.prototype.ResponseReceived = function () {
            this._gameView.ShowNewSymbols();
        };
        /*
        *   Checks the end of the game and sets the game state to
        *   correct value.
        *   if the game had a bonus publish the event to send the spin request
        */
        Game.prototype.CheckEndGame = function () {
            if (WinGame.responseModel.isBonus) {
                WinGame.stateMachine.setState |= WinGame.States.STATE_BONUS;
                WinGame.eventManager.Publish("sendSpinRequest");
                this._gameView.ShowBonus();
            }
            else {
                WinGame.stateMachine.setState = WinGame.States.STATE_IDDLE;
                WinGame.eventManager.Publish("gameClosed");
            }
        };
        return Game;
    })();
    window.onload = function () {
        WinGame.eventManager = new WinGame.EventManager();
        WinGame.stateMachine = new WinGame.StateMachine();
        WinGame.soundManager = new WinGame.SoundManager();
        WinGame.responseModel = new WinGame.ResponseModel();
        WinGame.game = new Game();
        WinGame.game.Init();
    };
})(WinGame || (WinGame = {}));
//# sourceMappingURL=app.js.map