const ffmpeg = require("fluent-ffmpeg");

const ffmpegPath = require("ffmpeg-static");

const fs = require("fs");

const path = require("path");

ffmpeg.setFfmpegPath(ffmpegPath);

async function mergeAudio(audioFiles) {

  return new Promise((resolve, reject) => {

    const fileListPath = path.join(

      __dirname,

      "../audio/audio-list.txt"

    );

    const fileContent = audioFiles

      .map(
        file =>
          `file '${file.replace(/\\/g, "/")}'`
      )

      .join("\n");

    fs.writeFileSync(
      fileListPath,
      fileContent
    );

    const outputPath = path.join(

      __dirname,

      `../audio/final-audio-${Date.now()}.mp3`

    );

    ffmpeg()

      .input(fileListPath)

      .inputOptions([
        "-f concat",
        "-safe 0"
      ])

      .outputOptions([
        "-c copy"
      ])

      .save(outputPath)

      .on("end", () => {

        console.log(
          "\n✅ Audio merged\n"
        );

        resolve(outputPath);

      })

      .on("error", reject);

  });

}

module.exports = mergeAudio;