const socket = io();
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const messageInput = document.getElementById('message-input');

const token = localStorage.getItem('jwtToken');
const decodeBase64 = str => {
    try {
      return atob(str);
    } catch (e) {
      console.error('Error decoding base64:', e);
      return null;
    }
  };
  
  // Divide el token en sus secciones (header, payload, signature)
  const [headerB64, payloadB64, signatureB64] = token.split('.');
  
  // Decodifica cada sección base64
  const decodedHeader = decodeBase64(headerB64);
  const decodedPayload = decodeBase64(payloadB64);
  
  // Convierte el contenido decodificado en objetos JavaScript
  const parsedHeader = JSON.parse(decodedHeader);
  const parsedPayload = JSON.parse(decodedPayload);
  
  // Accede a los claims que necesitas, por ejemplo, 'username'
  const username = parsedPayload.user.name;
  
  console.log('Username:', username);

console.log('Username:', username);
const showMessages = (messages) => {
    chatMessages.innerHTML = ''; // Borra el contenido actual del chat
    for (let message of messages) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.innerHTML = `<p><strong>${message.user} dice:</strong> <strong>${message.message}</strong> </p>`;
        chatMessages.appendChild(mensajeDiv);
    }
};

const sendMessage = () => {
    let user = username;
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