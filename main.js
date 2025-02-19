const API_KEY = 'AIzaSyBlOS0f6YCFOUf8kamAtaV8I7S2pSwang8';
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

async function fetchData(query) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: query
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error: ${response.status}`, errorText);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error:', error);
        return `Error: ${error.message}`;
    }
}

// Function to append messages to the chat box
function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerText = message;
    document.getElementById('messages').appendChild(messageElement);
}

// Update the event listener to use the new typing indicator
document.getElementById('send-button').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    // Add user message
    appendMessage('user', userInput);
    document.getElementById('user-input').value = '';

    // Show typing indicator
    const typingIndicator = showTypingIndicator();
    
    try {
        // Get AI response
        const aiResponse = await fetchData(userInput);
        
        // Remove typing indicator
        removeTypingIndicator(typingIndicator);
        
        // Add AI response
        appendMessage('ai', aiResponse);
    } catch (error) {
        removeTypingIndicator(typingIndicator);
        appendMessage('ai', 'Sorry, I encountered an error while processing your request.');
    }
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
});

const chatBox = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;
    chatBox.appendChild(indicator);
    chatBox.scrollTop = chatBox.scrollHeight;
    return indicator;
}

function removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
    }
}
