// Sélection des éléments HTML
const sendButton = document.getElementById('send-btn');
const inputField = document.getElementById('user-input');
const messageContainer = document.getElementById('chat-messages');

// Clé et URL de l'API Gemini
const API_KEY = "AIzaSyCx63U52UPgnBMGywo_xzv0Wx0DsIMqvjE"; // Mets ta clé API ici
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Fonction pour ajouter un message dans le chat
function addMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.textContent = text;
    messageContainer.appendChild(messageDiv);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll auto en bas
    return messageDiv;
}

// Fonction pour afficher le texte progressivement (effet "typing")
function typeMessage(element, text, speed = 50) {
    element.textContent = ""; // Vide le contenu
    let i = 0;
    function typingEffect() {
        if (i < text.length) {
            element.textContent += text[i];
            i++;
            setTimeout(typingEffect, speed);
        }
    }
    typingEffect();
}

// Fonction d'envoi du message
function sendMessage() {
    const message = inputField.value.trim();
    if (message === "") return;

    addMessage(message, "user-message"); // Affiche le message utilisateur
    inputField.value = "";

    // Affiche "Le bot réfléchit..."
    const botDiv = addMessage("Le bot réfléchit...", "bot-message");

    // Envoi de la requête à l'API Gemini
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ 
                parts: [{ 
                    text: `Tu es un assistant spécialisé en developpement personel. Réponds aux questions liées aux developpement personnel de manière détaillée sans ignorer les salutations les plus courantes que tu connais ect, quelque qualité que tu dois avoir, ne repond pas de maninière brusque mais cherche plutot à l'orienter vers d'autres sujet si la question n'est pas liée au developement personnel, dis que ce n'est pas ta spécialité ne soit pas trop long ni trop coup analyse et trouve juste le bon milieu.\n\nQuestion: ${message}`
                }]
            }]
        })
    })
    .then(response => response.json())
    .then(data => {
        const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas compris.";
        botDiv.textContent = ""; // Efface "Le bot réfléchit..."
        typeMessage(botDiv, botResponse); // Affichage progressif
    })
    .catch(error => {
        console.error("Erreur API :", error);
        botDiv.textContent = "Une erreur est survenue. Réessayez plus tard.";
    });
}

// Envoi du message en cliquant sur le bouton
sendButton.addEventListener("click", sendMessage);

// Envoi du message en appuyant sur "Entrée"
inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});
