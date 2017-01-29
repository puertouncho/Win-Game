/*
*   Global namespace for the project
*/
var WinGame;
(function (WinGame) {
    var NetworkManager = (function () {
        function NetworkManager() {
            var _this = this;
            this._URLSERVER = "http://127.0.0.1";
            if (NetworkManager._instance) {
                throw Error("An instance of the network manager was already instatiated");
                return;
            }
            NetworkManager._instance = this;
            // EVENTS 
            WinGame.eventManager.Register("sendSpinRequest", function () { _this.SendSpinRequest(); });
        }
        /*
        *   Sends a spin response to the server and handles the response
        */
        NetworkManager.prototype.SendSpinRequest = function () {
            var http = new XMLHttpRequest();
            var url = this._URLSERVER;
            var params = { request: "spinRequest" };
            var paramsString = JSON.stringify(params);
            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json; charset=utf-8");
            http.onreadystatechange = function () {
                if (http.readyState == 4 && http.status == 200) {
                    WinGame.responseModel.ParseResponse(http.responseText);
                }
            };
            http.send(paramsString);
        };
        return NetworkManager;
    })();
    WinGame.NetworkManager = NetworkManager;
})(WinGame || (WinGame = {}));
//# sourceMappingURL=networkManager.js.map