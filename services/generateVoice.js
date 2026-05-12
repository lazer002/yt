const { exec } = require("child_process");

const fs = require("fs");

const path = require("path");

async function generateVoice(
  text,
  index,
  retry = 0
) {

  return new Promise((resolve) => {

    // AUDIO FOLDER
    const outputDir = path.join(
      __dirname,
      "../audio"
    );

    // CREATE FOLDER IF NOT EXISTS
    if (!fs.existsSync(outputDir)) {

      fs.mkdirSync(outputDir);

    }

    // UNIQUE AUDIO FILE PER SCENE
    const outputPath = path.join(

      outputDir,

      `scene-${index}.mp3`

    );



    // CLEAN TEXT
    const cleanText = text

    .replace(/\[Scene:.*?\]/g, "")

      .replace(/\*\*/g, "")

      .replace(/\(.*?\)/g, "")

      .replace(/"/g, "")

      .replace(/\n/g, " ")

      .replace(/\s+/g, " ")

      .trim();



    console.log(
      `\nGenerating voice for scene ${index}...\n`
    );



    // EDGE TTS COMMAND
    const command =

      `py -m edge_tts ` +

      `--voice "hi-IN-SwaraNeural" ` +

      `--rate="+5%" ` +

      `--text "${cleanText}" ` +

      `--write-media "${outputPath}"`;



    exec(command, async (error) => {

      // COMMAND FAILED
      if (error) {

        console.log(
          `VOICE ERROR SCENE ${index}:`
        );

        console.log(error);



        // RETRY
        if (retry < 2) {

          console.log(
            `\nRetrying scene ${index}...\n`
          );

          const retryAudio =

            await generateVoice(

              text,

              index,

              retry + 1

            );

          return resolve(retryAudio);

        }

        return resolve(null);
      }



      // FILE EXISTS?
      if (!fs.existsSync(outputPath)) {

        console.log(
          `Voice file missing for scene ${index}`
        );

        return resolve(null);

      }



      // VALID FILE SIZE?
      const stats =
        fs.statSync(outputPath);

      if (stats.size < 1000) {

        console.log(
          `Invalid voice file for scene ${index}`
        );

        return resolve(null);

      }



      console.log(
        `\nVOICE CREATED: ${outputPath}\n`
      );

      resolve(outputPath);

    });

  });

}

module.exports = generateVoice;