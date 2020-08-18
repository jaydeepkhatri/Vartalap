const socket = io();
// const socket = io(`http://localhost:3000`);
const messageContainer = document.querySelector('#message-container');
const messageForm = document.querySelector('#send-container');
const innermain = document.querySelector("#innermain");
const currentusername = document.querySelector("#useractive");
const messageInput = document.querySelector('#message-input');
const usernameform = document.querySelector('#usernameform');
const loginoverlay = document.querySelector('#loginoverlay');
const sendbutton = document.querySelector("#send-button");
const likebtn = document.querySelector("#likebutton");

const sidebar = document.querySelector("#sidebar");
const useractivelist = document.querySelector("#useractivelist");
const screencover = document.querySelector("#screencover");

let currenttheme = "blue";
sendbutton.style.display = "none";
let emoji = "👍"
name = null;




const colorstheme = {
    pink: "--themecolor: rgb(255, 0, 106); --conmesscolor: rgb(255, 154, 196); --messageinputcolor: rgb(255, 240, 246);",
    blue: "--themecolor: rgb(31, 128, 255);	--conmesscolor: rgb(170, 184, 204);	--messageinputcolor: rgb(241, 247, 255); ",
    green: "--themecolor: rgb(0, 197, 66); --conmesscolor: rgb(187, 255, 209); --messageinputcolor: rgb(240, 255, 245); ",
    red: "--themecolor: rgb(255, 42, 42); --conmesscolor: rgb(255, 185, 185); --messageinputcolor: rgb(255, 243, 243);",
    purple: "--themecolor: rgb(183, 0, 255); --conmesscolor: rgb(232, 173, 255); --messageinputcolor: rgb(250, 236, 255);"
}
usernameform.addEventListener('submit', (e) => {
    e.preventDefault();
    name = document.querySelector('#username').value;
    if (name === "" || name === null) {
        alert("Wrtie a name");
    }
    if (name.match(/^[a-zA-Z0-9_ ]+$/)) {
        socket.emit('new-user', name);
        loginoverlay.style.display = "none";
        messageInput.focus();

        socket.on('chat-message', data => {
            appendMessage(data)
        });


        //? Socket connected
        socket.on('user-connected', data => {
            connectionMessage(`${data.name} joined`);
            sidebarusers(data.users);
            currentusername.innerHTML = Object.keys(data.users).length + " active";
            changetheme(data.theme);
        });


        //? Socket disconnected
        socket.on('user-disconnected', data => {
            //passing with full data because it need name of the user who left
            connectionMessage(`${data.name} left`);
            //removing the current user
            delete data.users[data.id];
            currentusername.innerHTML = Object.keys(data.users).length + " active";

            //updating it
            sidebarusers(data.users);
        });

        //? Update theme
        socket.on('themecolor', color => {
            changetheme(color);
        });
    }
    else {
        alert("Write a alphanumeric name")
    }
})

function changetheme(color) {
    document.documentElement.style.cssText = color;
    return true;
}

messageInput.addEventListener("input", (e) => {
    if (e.target.value === "") {
        sendbutton.style.display = "none";
        likebtn.style.display = "block";
    } else {
        sendbutton.style.display = "block";
        likebtn.style.display = "none";
    }
});




likebtn.addEventListener("click", (e) => {
    appendMessage({ username: name, message: emoji });
    socket.emit('send-chat-message', emoji);
});






//? User writing message
messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    if (message == "" || message == null || name == "" || name == null) {
        return null;
    } else {
        appendMessage({ username: name, message: message });
        socket.emit('send-chat-message', message);
        if (messageInput.value == "!green") {
            socket.emit('changetheme', colorstheme.green);
            changetheme(colorstheme.green);
        } else if (messageInput.value == "!blue") {
            socket.emit('changetheme', colorstheme.blue);
            changetheme(colorstheme.blue);
        } else if (messageInput.value == "!pink") {
            socket.emit('changetheme', colorstheme.pink);
            changetheme(colorstheme.pink);
        } else if (messageInput.value == "!red") {
            socket.emit('changetheme', colorstheme.red);
            changetheme(colorstheme.red);
        } else if (messageInput.value == "!purple") {
            socket.emit('changetheme', colorstheme.purple);
            changetheme(colorstheme.purple);
        }
        messageInput.value = '';
        innermain.scrollTop = innermain.scrollHeight;
    }
});


function connectionMessage(msg) {
    //log in to main chat
    const connectionEL = document.createElement("span");
    connectionEL.className = "conmess";
    connectionEL.innerHTML = msg;
    const messagediv = document.createElement("div");
    messagediv.className = "message messagecenter";
    messagediv.append(connectionEL);
    messageContainer.append(messagediv);
    innermain.scrollTop = innermain.scrollHeight;
}

function sidebarusers(users) {
    //log in to side bar
    useractivelist.innerHTML = "";

    Object.keys(users).forEach(key => {
        // console.log(users[key])
        const newuser = document.createElement("div");
        newuser.classList = "activeusersname";
        newuser.setAttribute("data-inital", getinitals(users[key]));
        newuser.innerHTML = users[key];
        useractivelist.append(newuser);
    });
}

function getinitals(name) {
    var initials = name.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials;
}
function appendMessage(data) {
    const messageElement = document.createElement('span');

    console.log(data);
    const messagediv = document.createElement("div");
    if (data.username === name) {
        messagediv.className = "message messagerightcont";
        if (data.message === "👍") {
            messageElement.className = "emoji";
        } else {
            messageElement.className = "messageright";
        }
    } else {
        messagediv.className = "message messageleftcont";
        if (data.message === "👍") {
            messageElement.className = "emoji";
        } else {
            messageElement.className = "messageleft";
        }
        const otherusername = document.createElement("p");
        otherusername.className = "username";
        otherusername.innerHTML = data.name;
        messageElement.append(otherusername);
    }
    messageElement.title = currentTime();
    messageElement.innerHTML += data.message;
    messagediv.append(messageElement);
    messageContainer.append(messagediv);
    innermain.scrollTop = innermain.scrollHeight;
}

function currentTime() {
    let d = new Date();
    let hours = d.getHours();
    let minutes = d.getMinutes();
    if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
    return `${hours} : ${minutes}`;
}



function openSidebar() {
    sidebar.style.width = "300px";
    screencover.style.display = "block";
}
function closeSidebar() {
    sidebar.style.width = "0";
    screencover.style.display = "none";
}