const fs = require("fs");
const path = require("path");

async function generateSubtitles(script) {

  const cleanScript = script
    .replace(/\*\*/g, "")
    .replace(/\(.*?\)/g, "");

  const lines = cleanScript
    .split("\n")
    .filter(line => line.trim());

  let srt = "";

  let start = 0;

  lines.forEach((line, index) => {

    const end = start + 3;

    srt += `${index + 1}\n`;
    srt += `00:00:${String(start).padStart(2, "0")},000 --> 00:00:${String(end).padStart(2, "0")},000\n`;
    srt += `${line.trim()}\n\n`;

    start = end;

  });

  const outputPath = path.join(
    __dirname,
    "../captions/subtitles.srt"
  );

  fs.writeFileSync(outputPath, srt);

  return outputPath;
}

module.exports = generateSubtitles;