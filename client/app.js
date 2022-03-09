var myname = '';
var myhead = 0;



//选择头像
function SelectedHead(e){
	let index = e.getAttribute("data-index");
	let lista=document.querySelectorAll(".head-list a");
	//清空选择
	for (let i = 0; i < lista.length; i++) {
		lista[i].style.cssText="border-width: 1px;";
	}
	//改变选择项
	lista[index].style.cssText="border-width: 4px;";
	myhead = index;
}
// 创建类
function App() {
	let doc = document;	//获取网页元素
	this.$input = doc.querySelector('#input');		// 获取输入框
	this.$content = doc.querySelector('.content');	//获取消息区div
	this.$sendBtn = doc.querySelector('.send-btn');	//获取发送键
	this.socket = io();	//获取socket
	//增加登录界面的两个控件
	this.$nameInput = doc.querySelector('.name-input');
	this.$nameBtn = doc.querySelector('.name-btn');
	this.$container = doc.querySelector('.container');
	this.$name_container = doc.querySelector('.name-container');
	this.$headbox = doc.querySelector('.head-list');
	
}

//编写类的成员函数
// 实现发送信息的功能
//发送消息
App.prototype.sendMsg = function () {

	let message = this.strEscape(this.$input.value);		//获取转义过的消息
	if (!message) return;		//如果没有消息则不发送

	this.socket.emit('client message', {
		head: myhead,
		text: message,	//用户输入的消息
		time: new Date()	//消息发送时间
	}, function (a) {	//回调函数
		//发送成功
	});

	//在自己界面增加消息
	this.$content.innerHTML += '<div class="head  head-right">\
			<div class="head-img"><img src="'+user_head[myhead]+'"></div>\
								<div class="list">\
									<p class="user-name text-right">'+myname+'</p>\
									<div class="section section-self">'+ message + '</div>\
								</div></div>';
	this.$content.scrollTop = this.$content.scrollHeight;
	this.$input.value = '';
};

//实现按回车键发送的功能
App.prototype.KeySendMsg = function (event) {
	if(event.keyCode == 13){
		let message = this.strEscape(this.$input.value);
		if (!message) return;

		this.socket.emit('client message', {
			head: myhead,
			text: message,
			time: new Date()
		}, function (a) {
			//发送成功
		});
		console.log("myname" + myname);
		this.$content.innerHTML += '<div class="head  head-right">\
		<div class="head-img"><img src="'+user_head[myhead]+'"></div>\
						<div class="list">\
							<p class="user-name text-right">'+myname+'</p>\
							<div class="section section-self">'+ message + '</div>\
						</div></div>';
		this.$content.scrollTop = this.$content.scrollHeight;
		this.$input.value = '';
	}
};

//发送名字
App.prototype.sendName = function () {

	let message = this.strEscape(this.$nameInput.value);		//获取转义过的消息
	if (!message) return;		//如果没有消息则不发送

	this.socket.emit('client name', {
		head: myhead,
		text: message,	//用户输入的消息
		time: new Date()	//消息发送时间
	}, function (a) {	//回调函数
		//发送成功
		myname = message;
		
		let box=document.getElementById("chat-login");
		box.remove();

	});
	this.$nameInput.value = '';
	
};
//实现按回车键发送名字的功能
App.prototype.KeySendName = function (event) {
	if(event.keyCode == 13){
		let message = this.strEscape(this.$nameInput.value);
		if (!message) return;

		this.socket.emit('client name', {
			head: myhead,
			text: message,
			time: new Date()
		}, function (a) {
			myname = message;
			//发送成功
			var box=document.getElementById("chat-login");
			box.remove();
		});
		this.$nameInput.value = '';
	}
};


//输入内容转义   
//TODO 没太搞懂它转义了什么
App.prototype.strEscape = function (str) {
	let div = document.createElement('div');
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