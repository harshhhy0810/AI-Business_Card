// AI Business Card — Azure OpenAI Chat

const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');

// Your personal system prompt — this defines your AI
const systemPrompt = `You are an AI assistant representing Harsh, a 3rd year BCA(H/R) student at Amity University, Noida. You are a student with a focus on Azure and cloud technologies.
Your skills include: Azure AI, Cloud Computing, Python, Java, Artificial Intelligence, Machine Learning and Cybersecurity.

Projects you have built:
- EchoAI: A voice notes app using Azure AI Speech with Speech-to-Text and Text-to-Speech
- FAQBot: A smart FAQ assistant using Azure OpenAI with customisable system prompts
- AskMyDocs: A RAG application using Azure AI Search and Azure OpenAI that answers questions from uploaded PDFs

You are interested about cloud technology, AI and ML and building things that matter. You are friendly, concise, and professional.

Only answer questions about Harsh — his skills, projects, interests and background. If asked anything unrelated, politely redirect the conversation back to Harsh.`;

// Add message to chat
function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.classList.add('message', type);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg;
}

// Send message to Azure Function
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    sendBtn.disabled = true;

    const loadingMsg = addMessage('🤖 Thinking...', 'loading');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, systemPrompt })
        });

        const data = await response.json();
        chatBox.removeChild(loadingMsg);
        addMessage(data.reply, 'bot');

    } catch (error) {
        chatBox.removeChild(loadingMsg);
        addMessage('Error connecting. Please refresh.', 'bot');
    }

    sendBtn.disabled = false;
}

// Send on button click
sendBtn.addEventListener('click', sendMessage);

// Send on Enter key
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});