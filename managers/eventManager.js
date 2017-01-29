/*
*   Global namespace for the project
*/
var WinGame;
(function (WinGame) {
    /*
    *  Main class of the game
    */
    var EventManager = (function () {
        function EventManager() {
            if (EventManager._instance) {
                throw Error("An instance of the game was already instatiated");
                return;
            }
            EventManager._instance = this;
        }
        /*
         *   Registers an event on the manager queue
         *   @param {String} idevent Name of the event
         *   @param {Function} callback Function that is called when the event is triggered
         */
        EventManager.prototype.Register = function (idevent, callback) {
            if (EventManager._registerObjects[idevent] === undefined) {
                EventManager._registerObjects[idevent] = [];
            }
            EventManager._registerObjects[idevent].push(callback);
        };
        /*
        *   Publish an event on the manager queue
        *   @param {String} idevent Name of the event
        */
        EventManager.prototype.Publish = function (idevent) {
            var callbacks = EventManager._registerObjects[idevent];
            if (callbacks === undefined) {
                throw Error("No one register for the event with id " + idevent);
                return;
            }
            var i;
            for (i = 0; i < callbacks.length; ++i) {
                callbacks[i]();
            }
        };
        EventManager._registerObjects = [[]];
        return EventManager;
    })();
    WinGame.EventManager = EventManager;
})(WinGame || (WinGame = {}));
//# sourceMappingURL=eventManager.js.map