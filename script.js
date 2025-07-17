let chats = [];
let currentChatId = null;

function newChat() {
  const chatId = Date.now();
  chats.push({ id: chatId, title: `Chat ${new Date().toLocaleString()}`, flashcards: [] });
  currentChatId = chatId;
  renderChatList();
  renderChat();
}

function renderChatList() {
  const list = document.getElementById("chat-history");
  list.innerHTML = "";
  chats.forEach(chat => {
    const item = document.createElement("li");
    item.className = "list-group-item list-group-item-action";
    item.textContent = chat.title;
    item.onclick = () => {
      currentChatId = chat.id;
      renderChat();
    };
    list.appendChild(item);
  });
}

function renderChat() {
  const chatArea = document.getElementById("chat-area");
  chatArea.innerHTML = "";
  const chat = chats.find(c => c.id === currentChatId);
  if (!chat) return;
  chat.flashcards.forEach((fc, i) => {
    const card = document.createElement("div");
    card.className = "flashcard";
    card.innerHTML = `
      <strong>Q${i + 1}:</strong> ${fc.question}<br>
      <button onclick="this.nextElementSibling.style.display='block'; this.remove();" class="btn btn-sm btn-outline-primary mt-2">Mostrar Respuesta</button>
      <div class="flashcard-answer">${fc.answer}</div>
    `;
    chatArea.appendChild(card);
  });
}

document.getElementById("upload-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const files = document.getElementById("file-input").files;
  if (!files.length || currentChatId === null) return;
  const chat = chats.find(c => c.id === currentChatId);
  for (let file of files) {
    const question = `¿Qué contiene el archivo '${file.name}'?`;
    const answer = `Este archivo es un ejemplo para flashcards. Nombre del archivo: ${file.name}`;
    chat.flashcards.push({ question, answer });
  }
  renderChat();
});

function descargarFlashcards() {
  if (currentChatId === null) return;
  const chat = chats.find(c => c.id === currentChatId);
  let content = chat.flashcards.map((fc, i) => `Q${i + 1}: ${fc.question}\nA${i + 1}: ${fc.answer}\n`).join("\n");
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Flashcards_${chat.title.replace(/\\s+/g, '_')}.txt`;
  a.click();
}

// Crear el primer chat por defecto
newChat();
