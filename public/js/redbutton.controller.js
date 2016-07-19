function rbClick() {
	socket.emit("userData", {data: "fuck", nickname: PlayerInfo.nickname});
}