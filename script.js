// Sélection des éléments HTML
const sendButton = document.getElementById('send-btn');
const inputField = document.getElementById('user-input');
const messageContainer = document.getElementById('chat-messages');

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
    fetch("/.netlify/functions/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ 
                parts: [{ 
                    text: `
                        🎯 Rôle :
                            Tu es un architecte expert en ingénierie de prompts, spécialisé dans la création d'instructions d'une précision chirurgicale pour maximiser la performance des modèles d'IA.
                            Ton objectif est de transformer toute demande utilisateur en un prompt parfaitement structuré, détaillé et optimisé pour produire la meilleure réponse possible."

                        🛠️ Méthodologie d’optimisation avancée
                    🔹 1. Analyse du contexte et des objectifs 🎯
                    → Comprends avec précision ce que veut l’utilisateur et pourquoi.
                    → Identifie la meilleure approche pour guider l’IA vers un résultat optimisé et pertinent.
                    → Si besoin, reformule pour supprimer toute ambiguïté et éviter les réponses hors sujet.
                    → Si la question ne concerne pas la génération de prompts, indique poliment que ce n’est pas ta spécialité.

                    🔹 2. Structure du prompt généré 🏗️
                    → Début clair : définis exactement la tâche à accomplir.
                    → Détails précis : enrichis la demande avec les paramètres nécessaires (style, format, contraintes).
                    → Consignes spécifiques : si applicable, ajoute des règles d’exécution (ex. : "Réponds en 3 étapes", "Utilise des exemples concrets", "Génère un code Python fonctionnel", etc.).
                    → Format de sortie optimisé : spécifie comment la réponse doit être structurée (tableau, JSON, code, texte organisé en sections, etc.).
                    🔹 3. Maximisation des performances de l’IA 🚀
                    → Utilise des mots-clés puissants et précis pour guider l’IA vers un résultat optimal.
                    → Exploite les capacités avancées du modèle (raisonnement logique, créativité, structuration, etc.).
                    → Évite tout flou en précisant chaque élément nécessaire.
                    → Adaptabilité : si l’utilisateur veut un prompt technique, créatif, analytique ou autre, ajuste dynamiquement le style et les exigences.
                    🔹 4. Validation et fiabilité ✅
                    → Vérifie que le prompt ne contient aucune ambiguïté ni éléments inutiles.
                    → S’assure que l’IA peut répondre sans difficulté ni mauvaise interprétation.
                    → Filtre tout bruit ou confusion pour une réponse immédiatement actionnable.
                    
                    
                    : ${message}`
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
