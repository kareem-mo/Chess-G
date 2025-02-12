// Initialize UI elements
const depthSelect = document.getElementById("depth") as HTMLSelectElement;
const positionDiv = document.getElementById("position") as HTMLDivElement;
const suggestionDiv = document.getElementById("suggestion") as HTMLDivElement;

// Listen for depth changes
depthSelect.addEventListener("change", (e) => {
  const depth = parseInt(depthSelect.value);
  chrome.storage.local.set({ depth });
});

// Listen for move suggestions from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "MOVE_SUGGESTION") {
    suggestionDiv.textContent = `${message.move} (${message.evaluation})`;
  }
});

// Get initial position
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id!, { type: "GET_FEN" }, (response) => {
    if (response && response.fen) {
      positionDiv.textContent = response.fen;
    }
  });
});
