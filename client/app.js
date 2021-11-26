// 创建类
function App() {
	var doc = document;	//获取网页元素
	this.$input = doc.querySelector('#input');		// 获取输入框
	this.$content = doc.querySelector('.content');	//获取消息区div
	this.$sendBtn = doc.querySelector('.send-btn');	//获取发送键
	this.socket = io();	//获取socket
	//增加登录界面的两个控件
	this.$nameInput = doc.querySelector('.name-input');
	this.$nameBtn = doc.querySelector('.name-btn');
	this.$container = doc.querySelector('.container');
	this.$name_container = doc.querySelector('.name-container');

}

//编写类的成员函数
// 实现发送信息的功能
//发送消息
App.prototype.sendMsg = function () {

	var message = this.strEscape(this.$input.value);		//获取转义过的消息
	if (!message) return;		//如果没有消息则不发送

	this.socket.emit('client message', {
		text: message,	//用户输入的消息
		time: new Date()	//消息发送时间
	}, function (a) {	//回调函数
		//发送成功
	});

	//在自己界面增加消息
	this.$content.innerHTML += '<div class="list">\
									<p class="user-name text-right"></p>\
									<div class="section section-self">'+ message + '</div>\
								</div>';
	this.$content.scrollTop = this.$content.scrollHeight;
	this.$input.value = '';
};

//实现按回车键发送的功能
App.prototype.KeySendMsg = function (event) {
	if(event.keyCode == 13){
		var message = this.strEscape(this.$input.value);
		if (!message) return;

		this.socket.emit('client message', {
			text: message,
			time: new Date()
		}, function (a) {
			//发送成功
		});

		this.$content.innerHTML += '<div class="list">\
										<p class="user-name text-right"></p>\
										<div class="section section-self">'+ message + '</div>\
									</div>';
		this.$content.scrollTop = this.$content.scrollHeight;
		this.$input.value = '';
	}
};

//发送名字
App.prototype.sendName = function () {

	var message = this.strEscape(this.$nameInput.value);		//获取转义过的消息
	if (!message) return;		//如果没有消息则不发送

	this.socket.emit('client name', {
		text: message,	//用户输入的消息
		time: new Date()	//消息发送时间
	}, function (a) {	//回调函数
		//发送成功
	});
	this.$nameInput.value = '';
};
//实现按回车键发送名字的功能
App.prototype.KeySendName = function (event) {
	if(event.keyCode == 13){
		var message = this.strEscape(this.$nameInput.value);
		if (!message) return;

		this.socket.emit('client name', {
			text: message,
			time: new Date()
		}, function (a) {
			//发送成功
		});
		this.$nameInput.value = '';
	}
};


//输入内容转义   
//TODO 没太搞懂它转义了什么
App.prototype.strEscape = function (str) {
	var div = document.createElement('div');
	if (div.innerText) {
		div.innerText = str;
	} else {
		div.textContent = str;//Support firefox
	}
	return div.innerHTML;
};


//滚动到底部
App.prototype.scroll = function () {
	this.$content.scrollTop = this.$content.scrollHeight;
};

//创建对象a
window.a = new App();