import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { JSDOM } from "https://esm.sh/jsdom";
import stockfish from "https://esm.sh/stockfish";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { fen, depth = 15 } = await req.json();

    // Initialize Stockfish
    const engine = stockfish();

    // Set up engine
    engine.postMessage("uci");
    engine.postMessage("isready");
    engine.postMessage(`position fen ${fen}`);
    engine.postMessage(`go depth ${depth}`);

    // Wait for best move
    return new Promise((resolve) => {
      engine.onmessage = (event) => {
        const msg = event.data;
        if (msg.startsWith("bestmove")) {
          const bestMove = msg.split(" ")[1];
          resolve(
            new Response(
              JSON.stringify({
                bestMove,
                evaluation: msg.includes("ponder") ? msg.split(" ")[3] : null,
              }),
              {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
              },
            ),
          );
        }
      };
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
