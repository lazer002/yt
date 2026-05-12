function extractScenes(script) {

  const scenes = [];

  // split scenes
  const parts = script.split("[Scene:");

  for (let i = 1; i < parts.length; i++) {

    const part = parts[i];

    // get keyword
    const endBracket =
      part.indexOf("]");

    const keyword =
      part
        .slice(0, endBracket)
        .trim();

    // get narration
    const text =
      part
        .slice(endBracket + 1)
        .trim();

    scenes.push({
      keyword,
      text,
    });

  }

  return scenes;
}

module.exports = extractScenes;