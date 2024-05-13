const socket = io();
const form = document.getElementById("sendcont");
const container = document.querySelector(".container");
const messageInput = document.getElementById("send_msg");
const messageContainer = document.getElementById("messagebox");
let audio1 = new Audio("/sounds/notification.mp3");
let audio2= new Audio("/sounds/userjoinleave.mp3")


const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.appendChild(messageElement);

  console.log(messageContainer);

 };

const username = prompt("Enter your Username:");

socket.emit("new_user_joined", username);

socket.on("user-joined", (username) => {
  console.log(username);
  append(`${username} joined the party`, "center");
  audio2.play();
});

socket.on("user-left", (username) => {
  append(`${username} has left`, "center");
  audio2.play();
});

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  //#region first option
  socket.emit("new-message", messageInput.value);
  messageInput.value = "";
});

io().on("update-messages", (messages) => {
  messageContainer.innerHTML = "";
  messages.forEach((item) => {
    const pos = item?.pos
      ? item?.pos
      : socket.id === item.id
      ? "left"
      : "right";
      append(item.message, pos);
      audio1.play()
  });
});
