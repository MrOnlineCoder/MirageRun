function rvInit(initData) {
	$("#rvWord").html(initData);
}

function rvSendResult() {
	socket.emit("userData", {data:$("#rvResult").val(), nickname: PlayerInfo.nickname});
}