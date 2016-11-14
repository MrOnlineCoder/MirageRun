/*
 MirageRun Client-side Core
 Author: MrOnlineCoder

 2016
 */

"use strict";

var socket;
var sound;
var enableSound = true;

var PlayerInfo = {
    nickname: "N/A",
    score: 0
};

function updateInfo() {
    //socket.emit("getOnline", {});
}

function noop(arg) {

}

/*
    I have to implement it, because jquery does not have it :(
    jQuery is not bad, but it is developed ages, why not add isEmpty function to it?
*/

function isEmpty( el ){
    return !$.trim(el.val())
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
        if (enableSound) sound.play();
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
    if (isEmpty($("#nickname"))) {
        showError("Enter your nickname!");
        return;
    }

    PlayerInfo.nickname = $("#nickname").val();
    if (/^<[^>]*>$/.test(PlayerInfo.nickname)) {
        showError("Nickname cannot contain HTML tags! (> and < symbols)");
        return;
    }
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
    Loader.init($("#gameView")[0]);

    Loader.addBlock("IDLE", $("#idleState")[0], noop);
    Loader.addBlock("WORDTYPE", $("#wordTypeState")[0], ftInit);
    Loader.addBlock("ZEROFIND", $("#zeroFindState")[0], zfInit);
    Loader.addBlock("REDBUTTON", $("#redButtonState")[0], noop);
    Loader.addBlock("CALC", $("#calcState")[0], clInit);
    Loader.addBlock("SPACE", $("#spaceState")[0], spInit);
    Loader.addBlock("REVERSE", $("#reverseState")[0], rvInit);
    Loader.addBlock("END", $("#endState")[0], endInit);

    sound = new Audio("./res/update.wav");
    sound.autoplay = false;

    $("#error").hide();
    $("window").on("beforeunload", function() { 
        socket.disconnect();
    });
    $("#soundToggle").click(function(e) {
        enableSound = !enableSound;
        if (enableSound) {
            $("#toggleIcon").attr("src", "/res/sound_on.png");
        } else {
            $("#toggleIcon").attr("src", "/res/sound_off.png");
        }
    });
}

init();