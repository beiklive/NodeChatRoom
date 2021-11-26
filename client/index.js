//获取对象a的通信句柄
var socket = a.socket;
var user_name;
//编写socket.io的功能
socket.on('connect', (skt) => {
	console.log(skt);
});


//允许用户进入聊天室
socket.on('user name', (data) => {
	var flag = data.flag;
	user_name = data.name;
	console.log('name = ' + user_name);
	if (flag == 'true') {
		a.$container.style.visibility = 'visible';
		a.$name_container.style.visibility = 'hidden';
	}
});

//通知用户进入聊天室
socket.on('user conncet', (data) => {
	var str = data + '进入聊天室';
	a.$content.innerHTML += '<div class="list text-center">\
								<div class="info">'+ str + '</div>\
							</div>';
	a.scroll();
});

//通知用户离开聊天室
socket.on('user disconnect', (data) => {
	var str = data + '离开聊天室';
	a.$content.innerHTML += '<div class="list text-center">\
								<div class="info">'+ str + '</div>\
							</div>';
	a.scroll();
});

//接收消息
socket.on('server message', (data) => {
	// console.log(data);
	if (data.author != user_name) {
		a.$content.innerHTML += '<div class="list">\
		<p class="user-name text-left">'+ data.author + '</p>\
		<div class="section">'+ data.text + '</div>\
	</div>';
	} else {
		a.$content.innerHTML += '<div class="list">\
		<p class="user-name text-right"></p>\
		<div class="section section-self">'+ data.text + '</div>\
	</div>';
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