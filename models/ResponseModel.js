/*
*   Global namespace for the project
*/
var WinGame;
(function (WinGame) {
    /*
    *  Main class of the response model
    */
    var ResponseModel = (function () {
        function ResponseModel() {
            if (ResponseModel._instance) {
                throw Error("An instance of the response model was already instatiated");
                return;
            }
            ResponseModel._instance = this;
        }
        /*
        *   Parses the response from the server
        *   @param {String} responseText Response from the server
        */
        ResponseModel.prototype.ParseResponse = function (responseText) {
            var responseData = JSON.parse(responseText);
            this.symbols = responseData.displaySymbols.split(",");
            this.typeWin = responseData.win;
            this.isBonus = responseData.isBonus;
            // Publish the event when everything were parsed
            WinGame.eventManager.Publish("responseParsed");
        };
        return ResponseModel;
    })();
    WinGame.ResponseModel = ResponseModel;
})(WinGame || (WinGame = {}));
//# sourceMappingURL=responseModel.js.map