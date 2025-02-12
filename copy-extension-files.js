import fs from "fs";
import path from "path";

// Create dist directory if it doesn't exist
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}

// Copy manifest.json
fs.copyFileSync("src/extension/manifest.json", "dist/manifest.json");

// Copy popup.html
fs.copyFileSync("public/popup.html", "dist/popup.html");

// Copy icons
fs.copyFileSync("public/icon16.png", "dist/icon16.png");
fs.copyFileSync("public/icon48.png", "dist/icon48.png");
fs.copyFileSync("public/icon128.png", "dist/icon128.png");

console.log("Extension files copied successfully!");
