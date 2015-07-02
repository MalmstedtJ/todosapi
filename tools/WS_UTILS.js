function broadcast(wss, message){
	wss.clients.forEach(function (client){
		client.send(message);
		console.log(message);
	});
}

function NotifyAdd(ws){
	var msg = {'event': 'todo.add', message: 'A new todo has been added!'}
	broadcast(ws, JSON.stringify(msg));
}

function  NotifyDelete(ws){
	var msg = {'event': 'todo.delete', message: 'A todo has been deleted!'}
	broadcast(ws, JSON.stringify(msg));
}

function NotifyRate(ws){
	var msg = {'event': 'todo.rate', message: 'A todo has been rated!'}
	broadcast(ws, JSON.stringify(msg));
}

module.exports.broadcast = broadcast;
module.exports.NotifyAdd = NotifyAdd;
module.exports.NotifyDelete = NotifyDelete;
module.exports.NotifyRate = NotifyRate;