let chats = [];
let flashcardsActuales = [];

function nuevoChat() {
  const titulo = document.getElementById("chatTitle").value.trim();
  if (!titulo) {
    alert("Debes escribir un nombre para el chat");
    return;
  }
  const chat = { titulo, fecha: new Date().toLocaleString(), flashcards: [] };
  chats.push(chat);
  actualizarListaChats();
  flashcardsActuales = chat.flashcards;
  document.getElementById("flashcards").innerHTML = "";
  document.getElementById("chatTitle").value = "";
}

function actualizarListaChats() {
  const lista = document.getElementById("chatList");
  lista.innerHTML = "";
  chats.forEach((chat, i) => {
    const li = document.createElement("li");
    li.textContent = `${chat.titulo}`;
    li.onclick = () => cargarChat(i);
    lista.appendChild(li);
  });
}

function cargarChat(index) {
  flashcardsActuales = chats[index].flashcards;
  renderizarFlashcards();
}

function procesarArchivos() {
  const input = document.getElementById("fileInput");
  const files = input.files;

  if (files.length === 0) {
    alert("Por favor, selecciona al menos un archivo.");
    return;
  }

  for (let file of files) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const contenido = e.target.result;
      const flashcards = generarFlashcardsDesdeTexto(contenido);
      flashcards.forEach(card => flashcardsActuales.push(card));
      renderizarFlashcards();
    };
    reader.readAsText(file);
  }
}

function generarFlashcardsDesdeTexto(texto) {
  const oraciones = texto.split(/[\.\n]+/).filter(p => p.trim().length > 10);
  return oraciones.slice(0, 10).map((oracion, i) => {
    return {
      pregunta: `¿Qué se entiende por: "${oracion.trim().substring(0, 50)}..."?`,
      respuesta: oracion.trim()
    };
  });
}

function renderizarFlashcards() {
  const contenedor = document.getElementById("flashcards");
  contenedor.innerHTML = "";
  flashcardsActuales.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<strong>Pregunta:</strong> ${card.pregunta}<br/><strong>Respuesta:</strong> ${card.respuesta}`;
    contenedor.appendChild(div);
  });
}

function descargarFlashcards() {
  if (flashcardsActuales.length === 0) {
    alert("No hay flashcards que descargar.");
    return;
  }

  const contenido = flashcardsActuales.map(fc => `P: ${fc.pregunta}\nR: ${fc.respuesta}`).join("\n\n");
  const blob = new Blob([contenido], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "flashcards.txt";
  link.click();
}
