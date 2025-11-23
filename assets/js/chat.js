// assets/js/chat.js
(function () {
  "use strict";

  // ⚙️ Adresse de ton bot Render
  // Change /chat en /api/chat si ton serveur l'utilise.
  const ENDPOINT = "https://elan-bot-1.onrender.com/chat";

  function addMessage(log, text, isUser) {
    if (!log) return;
    const div = document.createElement("div");
    div.className =
      "ept-chat__msg " +
      (isUser ? "ept-chat__msg--user" : "ept-chat__msg--bot");
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function showTyping(log) {
    if (!log) return null;
    const div = document.createElement("div");
    div.className = "ept-chat__typing";
    div.innerHTML = `
      <span class="ept-chat__typing-dot"></span>
      <span class="ept-chat__typing-dot"></span>
      <span class="ept-chat__typing-dot"></span>
      <span class="ept-chat__typing-label">Tom réfléchit…</span>
    `;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  async function sendToBot(message) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        return "⚠ Serveur indisponible (Render peut mettre du temps à se réveiller).";
      }

      const data = await res.json();
      return data.reply || "⚠ Pas de réponse du bot.";
    } catch (e) {
      console.error("[Élan-bot] Erreur réseau :", e);
      return "⚠ Impossible de contacter le serveur.";
    }
  }

  function initChat() {
    const root = document.getElementById("ept-chat");
    if (!root) return;

    const toggleBtn = document.getElementById("ept-chat-toggle");
    const dialog = document.getElementById("ept-chat-dialog");
    const closeBtn = document.getElementById("ept-chat-close");
    const log = document.getElementById("ept-chat-log");
    const form = document.getElementById("ept-chat-form");
    const input = document.getElementById("ept-chat-input");

    if (!toggleBtn || !dialog || !closeBtn || !log || !form || !input) {
      console.warn("[Élan-bot] éléments manquants dans le DOM.");
      return;
    }

    function openChat() {
      dialog.hidden = false;
      toggleBtn.setAttribute("aria-expanded", "true");
      dialog.setAttribute("aria-hidden", "false");
      setTimeout(() => input.focus(), 50);
    }

    function closeChat() {
      dialog.hidden = true;
      toggleBtn.setAttribute("aria-expanded", "false");
      dialog.setAttribute("aria-hidden", "true");
      toggleBtn.focus();
    }

    // Bouton flottant
    toggleBtn.addEventListener("click", () => {
      dialog.hidden ? openChat() : closeChat();
    });

    // Bouton fermer
    closeBtn.addEventListener("click", closeChat);

    // Échap pour fermer
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !dialog.hidden) {
        closeChat();
      }
    });

    // Raccourci Alt+M pour ouvrir/fermer
    document.addEventListener("keydown", (e) => {
      if (e.altKey && (e.key === "m" || e.key === "M")) {
        e.preventDefault();
        dialog.hidden ? openChat() : closeChat();
      }
    });

    // Envoi message
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      addMessage(log, text, true);
      input.value = "";
      input.focus();

      const typing = showTyping(log);
      const reply = await sendToBot(text);

      if (typing) typing.remove();
      addMessage(log, reply, false);
    });
  }

  window.addEventListener("DOMContentLoaded", initChat);
})();
