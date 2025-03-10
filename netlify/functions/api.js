// netlify/functions/geminiApi.js

// Utilisation d'importation dynamique pour `node-fetch`
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async function(event, context) {
  const API_KEY = process.env.GEMINI_API_KEY; // Utilisation de la variable d'environnement
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const requestData = JSON.parse(event.body);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Erreur lors de l’appel à l’API Gemini:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Une erreur est survenue' }),
    };
  }
};
