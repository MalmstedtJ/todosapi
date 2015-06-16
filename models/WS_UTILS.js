function broadcast(wss, message){
	wss.clients.forEach(function (client){
		client.send(message);
		console.log(message);
	});
}

module.exports.broadcast = broadcast;