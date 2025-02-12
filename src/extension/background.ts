import { supabase } from "../lib/supabase";

// Store last analyzed position to avoid duplicate requests
let lastAnalyzedFEN = "";

// Listen for messages from content script
chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "FEN_UPDATED") {
    const fen = message.fen;
    if (fen === lastAnalyzedFEN) return;
    lastAnalyzedFEN = fen;

    try {
      // Send FEN to Supabase for analysis
      const { data, error } = await supabase.functions.invoke(
        "analyze-position",
        {
          body: { fen, depth: 15 }, // Default depth
        },
      );

      if (error) throw error;

      // Send best move back to popup
      chrome.runtime.sendMessage({
        type: "MOVE_SUGGESTION",
        move: data.bestMove,
        evaluation: data.evaluation,
      });
    } catch (e) {
      console.error("Error analyzing position:", e);
    }
  }
});
