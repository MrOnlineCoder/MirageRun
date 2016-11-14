var spPresses = 0;

function spInit(data) {
	spPresses = 0;
	window.onkeypress =  function(e) {
		if (e.key == " " || e.key == "Spacebar") {
			spPresses++;
			$("#spInfo").html(spPresses+"x");

			if (spPresses == 10) {
				spSendResult();
			}
		}

	};
}

function spSendResult() {
	socket.emit("userData", {data: "done", nickname: PlayerInfo.nickname});
}