function zfInit(initData) {
	for(var i=0;i<initData.length;i++) {
		var a = document.createElement("button");
		a.className = "btn btn-link";
		if (initData[i]==0) {		
			a.onclick = zfClick;
		} 
		a.innerHTML = initData[i];
		$("#zfList").getNative().appendChild(a);
	}
}

function zfClick() {
	socket.emit("userData", {data:"Clicked!", nickname: PlayerInfo.nickname});
}