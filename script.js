const chatDiv = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendMessageButton = document.getElementById("sendMessage");
const addQAButton = document.getElementById("addQAButton");
const chatNameInput = document.getElementById("chatNameInput");
const setChatNameButton = document.getElementById("setChatName");

let chatName = "";
let qaPairs = [
    { question: "Olá", answer: "Olá, como posso te ajudar?" }
];
let customQAPairs = [];
let userNames = [];

userInput.disabled = true;
sendMessageButton.disabled = true;

// Função para adicionar perguntas e respostas ao Local Storage
function addQAItemToLocalStorage(question, answer) {
    const qaItem = { question, answer };
    customQAPairs.push(qaItem);
    localStorage.setItem('customQAPairs', JSON.stringify(customQAPairs));
}

// Função para carregar perguntas e respostas do Local Storage
function loadQAPairsFromLocalStorage() {
    const storedQAPairs = localStorage.getItem('customQAPairs');
    if (storedQAPairs) {
        customQAPairs = JSON.parse(storedQAPairs);
    }
}

// Carregar perguntas e respostas do Local Storage ao iniciar a página
loadQAPairsFromLocalStorage();

setChatNameButton.addEventListener("click", () => {
    const newName = chatNameInput.value;
    if (newName.trim() !== "") {
        chatName = newName;
        chatNameInput.value = "";
        userNames.push(newName);
        userInput.disabled = false;
        sendMessageButton.disabled = false;
        addMessageToChat(`Tudo bem, podemos começar`, "bot");
        // Salvar o nome do chat no Local Storage
        localStorage.setItem('chatName', chatName);
    }
});

// Carregar o nome do chat do Local Storage ao iniciar a página
const storedChatName = localStorage.getItem('chatName');
if (storedChatName) {
    chatName = storedChatName;
    userInput.disabled = false;
    sendMessageButton.disabled = false;
}

sendMessageButton.addEventListener("click", () => {
    const userQuestion = userInput.value;
    addMessageToChat(`${chatName}: ${userQuestion}`, "user");
    const chatResponse = getChatResponse(userQuestion);
    addMessageToChat(`Chatbot: ${chatResponse}`, "bot");
    userInput.value = "";
    qaPairs.push({ question: userQuestion, answer: chatResponse });
});

addQAButton.addEventListener("click", () => {
    const newQuestion = document.getElementById("newQuestion").value;
    const newAnswer = document.getElementById("newAnswer").value;

    if (newQuestion && newAnswer) {
        const newPair = { question: newQuestion, answer: newAnswer };
        if (!qaPairs.some(pair => pair.question === newQuestion)) {
            qaPairs.push(newPair);
            addQAItemToLocalStorage(newQuestion, newAnswer);
            document.getElementById("newQuestion").value = "";
            document.getElementById("newAnswer").value = "";
        }
    }
});

function getChatResponse(userQuestion) {
    userQuestion = normalizeText(userQuestion);

    const existingPair = qaPairs.find(pair => normalizeText(pair.question) === userQuestion);
    if (existingPair) {
        return existingPair.answer;
    } else {
        return "Não tenho uma resposta para essa pergunta. Que tal adicionar essa pergunta e resposta?";
    }
}

function normalizeText(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, "");
}

function addMessageToChat(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.textContent = message;
    chatDiv.appendChild(messageDiv);
}

if (userNames.length > 0) {
    chatName = userNames[userNames.length - 1];
}
addMessageToChat(`Olá, como posso te ajudar? Se você ainda não me disse o seu nome, me fale seu nome para começarmos!`, "bot");
