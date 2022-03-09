//获取对象a的通信句柄
var socket = a.socket;
var user_name;
var user_head;
//编写socket.io的功能
socket.on('connect', (skt) => {
	console.log(skt);
});

//允许用户进入聊天室
socket.on('Init head', (data) => {
	// var flag = data.flag;
	// user_name = data.name;
	// console.log('name = ' + user_name);
	// if (flag == 'true') {
	// 	a.$container.style.visibility = 'visible';
	// 	a.$name_container.style.visibility = 'hidden';
	// }
	user_head = data;
	console.log("data:" + data);
	a.$headbox.innerHTML += '\
		<a href="#" class="head-img" data-index="0" style="border-width: 4px;" onclick="SelectedHead(this)">\
			<img src="'+ data[0] +'">\
		</a>'
	for (let i = 1; i < data.length; i++) {
		// const element = array[i];
		a.$headbox.innerHTML += '\
		<a href="#" class="head-img" data-index="'+ i.toString() +'" onclick="SelectedHead(this)">\
			<img src="'+ data[i] +'">\
		</a>'
	}
});


//允许用户进入聊天室
socket.on('user name', (data) => {
	let flag = data.flag;
	user_name = data.name;
	console.log('name = ' + user_name);
	if (flag == 'true') {
		a.$container.style.visibility = 'visible';
		a.$name_container.style.visibility = 'hidden';
	}
});

//通知用户进入聊天室
socket.on('user conncet', (data) => {
	let str = data + '进入聊天室';
	a.$content.innerHTML += '<div class="list text-center">\
								<div class="info">'+ str + '</div>\
							</div>';
	a.scroll();
});

//通知用户离开聊天室
socket.on('user disconnect', (data) => {
	let str = data + '离开聊天室';
	a.$content.innerHTML += '<div class="list text-center">\
								<div class="info">'+ str + '</div>\
							</div>';
	a.scroll();
});

//接收消息
socket.on('server message', (data) => {
	// console.log(data);
	if (data.author != user_name) {
		a.$content.innerHTML += '<div class="head  head-left">\
		<div class="head-img"><img src="'+user_head[data.head]+'"></div>\
		<div class="list">\
		<p class="user-name text-left">'+ data.author + '</p>\
		<div class="section">'+ data.text + '</div>\
	</div></div>';
	} else {
		a.$content.innerHTML += '<div class="head  head-right">\
		<div class="head-img"><img src="'+user_head[data.head]+'"></div>\
		<div class="list">\
		<p class="user-name text-right">'+ data.author + '</p>\
		<div class="section section-self">'+ data.text + '</div>\
	</div></div>';
	}

	a.scroll();
});

//断连通知
socket.on('disconnect', (data) => {
	console.log('server disconnect: ' + JSON.stringify(data));
});

//绑定a中控件的触发函数
a.$sendBtn.onclick = a.sendMsg.bind(a);
a.$input.onkeypress = a.KeySendMsg.bind(a);
a.$nameBtn.onclick = a.sendName.bind(a);
a.$nameInput.onkeypress = a.KeySendName.bind(a);