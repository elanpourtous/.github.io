// assets/js/chatbot.js
(function () {
  "use strict";

  // 1) Afficher un message dans la zone de chat
  function addMessage(container, text, isUser) {
    if (!container) return;
    const div = document.createElement("div");
    div.className =
      "chat-message " +
      (isUser ? "chat-message--user" : "chat-message--bot");
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  // 2) Envoyer le texte au serveur Render
  async function sendToBot(message) {
    try {
      const res = await fetch("https://elan-bot-1.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        return "⚠ Serveur indisponible (Render peut mettre 40–50 s à se réveiller).";
      }

      const data = await res.json();
      return data.reply || "⚠ Pas de réponse du bot.";
    } catch (err) {
      console.error("[TomChat] Erreur réseau :", err);
      re
