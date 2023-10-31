const socket = io();
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const messageInput = document.getElementById('message-input');

const showMessages = (messages) => {
    chatMessages.innerHTML = ''; // Borra el contenido actual del chat
    for (let message of messages) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.innerHTML = `<p><strong>${message.user} dice:</strong> <strong>${message.message}</strong> </p>`;
        chatMessages.appendChild(mensajeDiv);
    }
};

const sendMessage = () => {
    let user = userInput.value;
    let message = messageInput.value;
    let newMessage = {
        user,
        message
    };
    socket.emit('message', newMessage);
};

socket.on('messages', (messages) => {
    showMessages(messages);
});