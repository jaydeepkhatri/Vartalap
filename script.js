const socket = io('http://localhost:3000');
const messageContainer = document.querySelector('#message-container');
const messageForm = document.querySelector('#send-container');
const innermain = document.querySelector("#innermain");
const currentusername = document.querySelector("#useractive");
const messageInput = document.querySelector('#message-input');
const usernameform = document.querySelector('#usernameform');
const loginoverlay = document.querySelector('#loginoverlay');


// const name = prompt('What is your name?');
// socket.emit('new-user', name);
let name = null;

usernameform.addEventListener('submit', (e) => {
	e.preventDefault();
	name = document.querySelector('#username').value;
	if (name === "" || name === null) {
		alert("Wrtie a name");
	} else {
		socket.emit('new-user', name);
		connectionMessage(`${name} joined`);

		currentusername.innerHTML = name;
		loginoverlay.style.display = "none";

		socket.on('chat-message', data => {
			appendMessage(data)
		})

		socket.on('user-connected', data => {
			connectionMessage(`${data} joined`);

		})

		socket.on('user-disconnected', name => {
			connectionMessage(`${name} left`)
		})

		socket.on('themecolor', color => {
			changetheme(color);
		})
	}
})

function changetheme(color) {
	document.documentElement.style.cssText = color;
	return true;
}

messageForm.addEventListener('submit', e => {
	e.preventDefault()
	const message = messageInput.value;
	if (message == "" || message == null || name == "" || name == null) {
		// connectionMessage("Write Message");
		alert("Becareful");
	} else {
		appendMessage({ username: name, message: message });
		socket.emit('send-chat-message', message)

		if (messageInput.value == "!green") {
			socket.emit('changetheme', "--themecolor: rgb(0, 197, 66); --conmesscolor: rgb(226, 255, 236)")
			changetheme("--themecolor: rgb(0, 197, 66); --conmesscolor: rgb(226, 255, 236)");
		} else if (messageInput.value == "!blue") {
			socket.emit('changetheme', "--themecolor: rgb(31, 128, 255);	--conmesscolor: #abc;")
			changetheme("--themecolor: rgb(31, 128, 255);	--conmesscolor: #abc;");
		} else if (messageInput.value == "!pink") {
			socket.emit('changetheme', "--themecolor: rgb(255, 0, 106);		--conmesscolor: rgb(255, 168, 204);")
			changetheme("--themecolor: rgb(255, 0, 106);		--conmesscolor: rgb(255, 168, 204);");
		}
		messageInput.value = '';
		innermain.scrollTop = innermain.scrollHeight;
	}
})


function connectionMessage(msg) {
	const connectionEL = document.createElement("span");
	connectionEL.className = "conmess";
	connectionEL.innerHTML = msg;
	const messagediv = document.createElement("div");
	messagediv.className = "message messagecenter";
	messagediv.append(connectionEL);
	messageContainer.append(messagediv);
	innermain.scrollTop = innermain.scrollHeight;
}

function appendMessage(data) {
	const messageElement = document.createElement('span');

	console.log(data);
	const messagediv = document.createElement("div");
	if (data.username === name) {
		messagediv.className = "message messagerightcont";
		messageElement.className = "messageright";
	} else {
		messagediv.className = "message messageleftcont";
		messageElement.className = "messageleft";
		const otherusername = document.createElement("p");
		otherusername.className = "username";
		otherusername.innerHTML = data.name;
		messageElement.append(otherusername);
	}
	messageElement.innerHTML += data.message;
	messagediv.append(messageElement);
	messageContainer.append(messagediv);
	innermain.scrollTop = innermain.scrollHeight;
}
function activeusers(totalusers) {
	document.querySelector("#useractive").innerHTML = totalusers;
}