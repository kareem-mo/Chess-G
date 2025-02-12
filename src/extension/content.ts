// Function to extract FEN from Chess.com board
function getCurrentFEN(): string {
  // Chess.com stores the game state in a global object
  const game = (window as any).game;
  if (!game) return "";

  try {
    return game.getFEN();
  } catch (e) {
    console.error("Error getting FEN:", e);
    return "";
  }
}

// Listen for board changes
let lastFEN = "";
setInterval(() => {
  const currentFEN = getCurrentFEN();
  if (currentFEN && currentFEN !== lastFEN) {
    lastFEN = currentFEN;
    chrome.runtime.sendMessage({ type: "FEN_UPDATED", fen: currentFEN });
  }
}, 1000);

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_FEN") {
    sendResponse({ fen: getCurrentFEN() });
  }
});
