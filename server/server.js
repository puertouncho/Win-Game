var http = require("http");
var fs = require("fs");
var server = http.createServer(function(request, response) {
    if (request.method === "POST") {
        HandlePostRequest(request, response);
    }
    else {
        var path = request.url;
        if (path === "/") {
            var html = fs.readFileSync('index.html');
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(html);
        }
        else {
            var re = /(?:\.([^.]+))?$/;
            var extension = re.exec(path)[1];
            switch (extension) {
                case "css": {
                    response.writeHead(200, { 'Content-Type': 'text/css' });
                } break;
                case "js": {
                    response.writeHead(200, { 'Content-Type': 'text/javascript' });
                }
            }

            try {
                fs.accessSync("."+path, fs.R_OK )
                fs.readFile("."+path, function (error, content) {
                    if (error) {
                        response.end();
                    }
                    else {
                        response.end(content, 'utf-8');
                        response.end();
                    }
                });

            } catch (e) {
                console.log("no Exist ");
                response.end();
            }
        }
    }
});

server.listen(80);
console.log("Server is listening");

function HandlePostRequest(request, response) {
    var body = '';
    response.writeHead(200, { 'Content-Type': 'text/html' });

    request.on('data', function (data) {
        body += data;
    });

    request.on('end', function () {

        var data = JSON.parse(body);

        switch (data.request) {
            case "spinRequest": {

                var responseJSON = GetResponseData();
                response.end(JSON.stringify(responseJSON));
            } break;
        }
    });
}

function GetResponseData() {
    var symbols = [],
                    newSymbol,
                    maxDuplicates = 1,
                    countDuplicates = 0,
                    bonus = false,
                    i, x;

    //Creating random symbols
    for (i = 0; i < 3; ++i) {
        newSymbol = Math.floor(Math.random() * (4 + 1));
        countDuplicates = 1;
        for (x = 0; x < symbols.length; ++x) {
            if (newSymbol === symbols[x]) {
                countDuplicates++;
            }
        }
        if (countDuplicates > maxDuplicates) {
            maxDuplicates = countDuplicates;
        }
        symbols.push(newSymbol);
    }

    // Probability of getting a bonus
    if (Math.random() > 0.85) {
        bonus = true;
    }

    var responseJSON = {
        displaySymbols: symbols.toString(),
        win: maxDuplicates,
        isBonus: bonus
    };

    return responseJSON;
}

