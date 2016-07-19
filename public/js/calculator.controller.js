function clInit(data) {
	$("#clExpression").html(data.num1 + " "+data.op+" "+data.num2);
	$("#clResult").val("");
	$("#clResult").focus();
}

function clSendResult() {
	socket.emit("userData", {data: $("#clResult").val(), nickname: PlayerInfo.nickname});
}