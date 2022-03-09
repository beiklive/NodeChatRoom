var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	port = process.env.PORT || 6603,	//服务器端口
	Online_Dic = new Array(),		//储存在线用户字典
	Online_HistoryData = new Array(),	//储存用户消息
	Online_HeadData = new Array(),	//储存用户头像消息
	Local_HeadStore = new Array(), //本地图像库
	History_Max = 50;				//储存的最大消息数

app.use(express.static(__dirname + '/client'));




function Read_LocalHead(){
	let fs = require('fs');

	let components = []
	const files = fs.readdirSync('./client/images')
	files.forEach(function (item, index) {
		let stat = fs.lstatSync("./client/images/"+item)
		if (stat.isDirectory() === false) { 
			// components.push(item)
			Local_HeadStore[index] = "images/"+item
		}
	})
	console.log(Local_HeadStore);
}

function Online_Head_Add(name, head) {
	Online_HeadData[name] = head;
}



function Online_Charge(ip_str) {	//判断用户是否存在
	if(Online_Dic[ip_str] == null){
		console.log('first login in');
		return false;
	}else{
		console.log('already login in');
		return true;
	}
}

function Online_Delete(id){
	delete Online_Dic[id];
}

function Online_DataSave(data) {
	while(Online_HistoryData.length >= History_Max){	//删除多余记录
		Online_HistoryData.unshift();	//删除数组第一个元素
	}
	Online_HistoryData.push(data);//插入到数组尾
}

function Online_DataRead(index) {
	return Online_HistoryData[index];
}

function Online_Add(ip_str, name) {	//增加在线用户，返回用户名
	console.log('注册用户');
	Online_Dic[ip_str] = name;
	return Online_Dic[ip_str];
}

function Online_Get(ip_str) {	//获取在线用户，返回用户名
	console.log('获取用户')
	return Online_Dic[ip_str];
}

io.on('connection', (socket) => {
	// console.log('a user connected，id: ' + socket.id);
	// var clientIp = socket.request.connection.remoteAddress.substring(7);	//获取用户所连服务器的ip
	let clientIp = socket.id;
	// console.log("IP:" + clientIp);
	//处理登录用户的名字
	let user;
	Read_LocalHead();
	console.log('Init head')

	socket.emit('Init head', Local_HeadStore);		//发送消息给所有客户端
	if(Online_Charge(clientIp)){
		user = Online_Get(clientIp);
		socket.emit('user name', {			//发送给当前通信的客户端
			flag : 'true',
			name : user	
		});
		
		for(let i = 0; i < Online_HistoryData.length; i++){	//读取历史记录
			socket.emit('server message', Online_DataRead(i));
		}
		//通知用户进入
		io.emit('user conncet', user);		//发送消息给所有客户端
	}
	
	//接收客户端用户名
	socket.on('client name', (data, cb) => {
		// console.log(data);
		cb('recieved');
		let name = data.text;
		let head = data.head;
		console.log('get user name: '+ data.text);
		console.log('get user head: '+ data.head);
		user = Online_Add(clientIp, name);
		Online_Head_Add(user, head);
		socket.emit('user name', {   //发送给当前通信的客户端
			flag : 'true',
			name : user	
		});
		
		for(let i = 0; i < Online_HistoryData.length; i++){	//读取历史记录
			socket.emit('server message', Online_DataRead(i));
		}
		io.emit('user conncet', user);  //发送消息给所有客户端
	});

	//接收客户端消息
	socket.on('client message', (data, cb) => {
		// console.log(data);
		cb('recieved');
		Online_DataSave(data);
		data.author = user;
		console.log(data.author)
		console.log(data.text)
		console.log(data.time)
		//广播给除自己以外的客户端
		socket.broadcast.emit('server message', data);
	});

	//通知用户离开
	socket.on('disconnect', () => {
		user = Online_Get(clientIp);
		Online_Delete(clientIp);
		// console.log('user disconnected');
		io.emit('user disconnect', user);
	});

	// io.clients((err, clients) => {
	// 	if (!err) console.log(clients);
	// });
});

server.listen(port, () => {
	console.log('listening on %d...', port);
	console.log('open browser: 127.0.0.1:%d', port)
});
