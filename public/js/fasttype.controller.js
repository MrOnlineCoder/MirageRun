function ftInit(initData) {
    $("#ftWord").html(initData);
    $("#ftUserWord").val("");
    $("#ftUserWord").focus();
}


function ftSendWord() {
	socket.emit("userData", {data: $("#ftUserWord").val(), nickname: PlayerInfo.nickname});
}

