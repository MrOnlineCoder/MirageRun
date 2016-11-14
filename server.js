/*
    MirageRun Server file
    Author: MrOnlineCoder

    2016
 */


// ##########
// Connecting modules
// ##########
var express = require("express");
var util    = require("./util.js");
var app     = express();
var http    = require("http").Server(app);
var sanitizeHtml = require('sanitize-html');

// ##########
// Setting up server and variables
// ##########

var serverPort = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

// ##########
// Creating states and logic
// ##########
var states = [];
var currentState = 0;
var scoreboard = {};
var isWon = false;

/*
    How States work?

    Each state has 5 required fields:
    init() - calls when on state change, must return data to send to players
    tick() - calls every second as timer, if returns true, current state will be changed
    handleData() - handles data from players, if returns true, then the sender is the winner
    type - type of state, used by client
    text - display name of game

*/

var IdleState = {
    time: 10,
    type: "IDLE",
    text: "Waiting for players",
    init: function() {
        this.time = 10;
        return {};
    },
    tick: function() {
        this.time--;
        if (this.time <= 0) {
            this.time = 10;
            return  (getClientsCount() >= 2);
        }

        return false;
    },
    handleData: function(data) {
        // no-op in this state
    }
};

var FastTypeState = {
    time: 15,
    type: "WORDTYPE",
    text: "Type the Word as fast as you can!",
    word: "",
    init: function() {
        this.time = 15;
        this.word = util.randomString(10);
        return this.word;
    },
    tick: function() {
        this.time--;
        if (this.time <= 0) {
            return true;
        }
        return false;
    },
    handleData: function(data) {
        if (data == this.word) {
            this.time = 3;
            return true;
        }
    }
};

var ZeroFindState = {
    time: 10,
    type: "ZEROFIND",
    text: "Zero Hunting",
    arr: [],
    init: function() {
        this.time = 10;
        this.arr = util.randomArrayToFind(126); // 126 because it fits just very nice on screen :)  
        return this.arr;
    },
    tick: function() {
        this.time--;
        if (this.time <= 0) {
            return true;
        }
        return false;
    },
    handleData: function(data) {
        if (data == "Clicked!") {
            this.time = 3;
            return true;
        }
    }
};

var RedButtonState = {
    time: 5,
    type: "REDBUTTON",
    text: "Click the Button!",
    init: function() {
        this.time = 5;
        return {};
    },
    tick: function() {
        this.time--;
        if (this.time <= 0) {
            return true;
        }
        return false;
    },
    handleData: function(data) {
        if (data == "fuck") {
            this.time = 3;
            return true;
        }
    }
};

var CalcState = {
    time: 30,
    type: "CALC",
    text: "Calculator",
    num1: 0,
    num2: 0,
    op: "+",
    init: function() {
        this.time = 30;
        this.num1 = util.randomInt(0,100);
        this.num2 = util.randomInt(0,100);
        if (this.op == "+") this.op = "-";
        if (this.op == "-") this.op = "+";

        return {num1: this.num1, num2: this.num2, op: this.op};
    },
    tick: function() {
        this.time--;
        if (this.time <= 0) {
            return true;
        }
        return false;
    },
    handleData: function(data) {
        if (this.op == "+") {
            if ((this.num1 + this.num2) == parseInt(data)) {
                this.time = 3;
                return true;
            }
        } else {
            if ((this.num1 - this.num2) == parseInt(data)) {
                this.time = 3;
                return true;
            }
        }

        return false;
    }
};

var SpaceState = {
    time: 10,
    type: "SPACE",
    text: "Space It",
    init: function() {
        this.time = 10;
    },
    tick: function() {
        this.time--;
        if (this.time <= 0) {
            return true;
        }
        return false;
    },
    handleData: function(data) {
        if (data == "done") {
            this.time = 3;
            return true;
        }

        return false;
    }
};


var ReverseState = {
    time: 20,
    type: "REVERSE",
    word: "",
    result: "",
    text: "Mr. Reverse",
    init: function() {
        this.time = 20;
        this.result = util.getWordFromList();
        this.word = util.reverseString(this.result);

        return this.word;
    },
    tick: function() {
        this.time--;
        if (this.time <= 0) {
            return true;
        }
        return false;
    },
    handleData: function(data) {
        if (data.toLowerCase() == this.result) {
            this.time = 3;
            return true;
        }

        return false;
    }
};


var EndState = {
    time: 5,
    type: "END",
    text: "Match ended",
    init: function() {
        this.time = 5;
        var winners = util.sortHashmap(scoreboard);
        var topPlayer = winners[0];
        scoreboard = {};
        return topPlayer;
    },
    tick: function() {
        this.time--;
        if (this.time <= 0) {
            return true;
        }

        return false;
    },
    handleData: function(data) {
        //no-op
    }
}

function getCurrentState() {
    return states[currentState];
}

/*
    Thanks to: http://stackoverflow.com/a/6274398/5605426
*/

function shuffle(array) {
    var counter = array.length - 1;

    // While there are elements in the array
    while (counter > 2) {
        // Pick a random index
        var index = Math.floor(Math.random() * (counter - 1) + 1)  ;

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function nextState() {
    currentState++;
    isWon = false;
    if (currentState == states.length) {
        states = shuffle(states);
        console.log("Shuffle result: ");
        for(var i = 0; i<states.length;i++) {
            console.log(states[i].type);
        }
        currentState = 0;
    }
    broadcastState(states[currentState].init());
    broadcastStatus(states[currentState].text);
}

var globalTick = function() {
    if (states[currentState].tick()) {
        //console.log("[Game] State timed out, proceeding to next state!");
        nextState();
    }

    broadcastTime();
}

// ##########
// Starting server
// ##########

console.log("[!] Starting HTTP server...");
var server = app.listen(serverPort, function() {
    console.log("Server successfully started on port " + serverPort);
});

console.log("[!] Starting Socket.io server...");
var io = require("socket.io")(server);


var getClientsCount = function() {
    return io.engine.clientsCount;
};

function broadcastOnline() {
    io.sockets.emit("online", getClientsCount());
}



function broadcastTime() {
     io.sockets.emit("time", getCurrentState().time);
}

function broadcastStatus(text) {
    io.sockets.emit("status", text);
}

function broadcastState(data) {
    io.sockets.emit("stateChange", {type: states[currentState].type, data: data});
}

io.on("connection", function (socket) {
    console.log("User connected!");
    broadcastOnline();
    socket.emit("status","You will join the game next round");

    socket.on("userData", function(data) {
        if (isWon) return;
        if(states[currentState].handleData(data.data)) {
            var cleanNickname = sanitizeHtml(data.nickname, {
                allowedTags: [],
                allowedAttributes: []
            });
            console.log("[Round] Player has done the task: "+cleanNickname);
            isWon = true;
            broadcastStatus(cleanNickname+" wins the round!");
            scoreboard[cleanNickname]++;
        }
    });

    socket.on("disconnect", function() {
        broadcastOnline();
    });

});

states.push(IdleState);
states.push(FastTypeState);
states.push(ZeroFindState);
states.push(RedButtonState);
states.push(CalcState);
states.push(SpaceState);
states.push(ReverseState);
states.push(EndState);


setInterval(globalTick, 1000);