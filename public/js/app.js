/*
 MirageRun Client-side Core
 Author: MrOnlineCoder

 2016
 */

"use strict";

var socket;
var sound;

var PlayerInfo = {
    nickname: "N/A",
    score: 0
};

function updateInfo() {
    //socket.emit("getOnline", {});
}

function noop(arg) {

}

function setupSocket() {
    socket = io();
    socket.on("online", function (data) {
        console.log("[Socket] Online changed = "+data);
        $("#playersOnline").html(data);
    });

    socket.on("time", function (data) {
        $("#gameTime").html(data);
    });

    socket.on("status", function (data) {
        $("#gameStatus").html(data);
        sound.play();
    });

    socket.on("stateChange", function (data) {
        if (data.type == "IDLE") {
            $("#gameType").html("Waiting for players");
        } else if (data.type == "END") {
            $("#gameType").html("Summary");
        } else {
            $("#gameType").html("In-game");
        }

        Loader.setBlock(data.type, data.data);
    });

}



function play() {
    if ($("#nickname").isEmpty()) {
        showError("Enter your nickname!");
        return;
    }

    PlayerInfo.nickname = $("#nickname").val();
    $("#playerNick").html(PlayerInfo.nickname);

    $("#game").show();
    $("#login").hide();

    setupSocket();
    updateInfo();
}


function showError(msg) {
    $("#error").show();
    $("#error").html("Error: "+msg);
}

function init() {
	SULasJQuery(true);
    Loader.init($("#gameView").getNative());

    Loader.addBlock("IDLE", $("#idleState").getNative(), noop);
    Loader.addBlock("WORDTYPE", $("#wordTypeState").getNative(), ftInit);
    Loader.addBlock("ZEROFIND", $("#zeroFindState").getNative(), zfInit);
    Loader.addBlock("REDBUTTON", $("#redButtonState").getNative(), noop);
    Loader.addBlock("CALC", $("#calcState").getNative(), clInit);
    Loader.addBlock("SPACE", $("#spaceState").getNative(), spInit);
    Loader.addBlock("REVERSE", $("#reverseState").getNative(), rvInit);
    Loader.addBlock("END", $("#endState").getNative(), endInit);

    sound = new Audio("./res/update.wav");
    sound.autoplay = false;

    $("#error").hide();
    $("window").on("beforeunload", function() { 
        socket.disconnect();
    });
}

init();