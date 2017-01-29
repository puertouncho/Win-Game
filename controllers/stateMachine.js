var WinGame;
(function (WinGame) {
    (function (States) {
        States[States["STATE_IDDLE"] = 1] = "STATE_IDDLE";
        States[States["STATE_SPINNING"] = 2] = "STATE_SPINNING";
        States[States["STATE_BONUS"] = 4] = "STATE_BONUS";
    })(WinGame.States || (WinGame.States = {}));
    var States = WinGame.States;
    /*
    *  Main class of the State Machine
    */
    var StateMachine = (function () {
        function StateMachine() {
            this._state = States.STATE_IDDLE;
            if (StateMachine._instance) {
                throw Error("An instance of the state machine was already instatiated");
                return;
            }
            StateMachine._instance = this;
        }
        Object.defineProperty(StateMachine.prototype, "getState", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StateMachine.prototype, "setState", {
            set: function (state) {
                this._state = state;
            },
            enumerable: true,
            configurable: true
        });
        return StateMachine;
    })();
    WinGame.StateMachine = StateMachine;
})(WinGame || (WinGame = {}));
//# sourceMappingURL=stateMachine.js.map