const ffmpeg = require("fluent-ffmpeg");
const getBackgroundMusic =
  require("./getBackgroundMusic");
const ffmpegPath =
  require("ffmpeg-static");

const fs = require("fs");

const path = require("path");

ffmpeg.setFfmpegPath(ffmpegPath);

async function renderVideo(
  videoPath,
  subtitlePath,
  audioPath,
  topic
) {

  return new Promise((resolve, reject) => {

    const outputDir = path.join(
      __dirname,
      "../output"
    );

    if (!fs.existsSync(outputDir)) {

      fs.mkdirSync(outputDir);

    }

    const outputPath = path.join(

      outputDir,

      `final-${Date.now()}.mp4`

    );



    // BACKGROUND MUSIC
const musicPath =
  getBackgroundMusic(topic);



    console.log(
      "\nRENDERING VIDEO...\n"
    );



    const command = ffmpeg();



    // VIDEO
    command.input(videoPath);

    // NARRATION
    command.input(audioPath);

    // MUSIC
    command.input(musicPath);



    command

      .complexFilter([

        // LOWER MUSIC VOLUME
        "[2:a]volume=0.12[bgm]",

        // MIX NARRATION + MUSIC
        "[1:a][bgm]amix=inputs=2:duration=shortest[aout]"

      ])



      .videoFilters([

        "scale=720:1280:force_original_aspect_ratio=increase",

        "crop=720:1280"

      ])



      .videoCodec("libx264")



      .audioCodec("aac")



      .outputOptions([

        "-map 0:v",

        "-map [aout]",

        "-preset ultrafast",

        "-shortest"

      ])



      .on("start", (cmd) => {

        console.log(
          "\nFFMPEG CMD:\n"
        );

        console.log(cmd);

      })



      .on("progress", (progress) => {

        const percent = Math.floor(
          progress.percent || 0
        );

        process.stdout.clearLine(0);

        process.stdout.cursorTo(0);

        process.stdout.write(
          `🎬 Rendering Video: ${percent}%`
        );

      })



      .on("end", () => {

        console.log(
          "\n\n✅ VIDEO RENDERED\n"
        );

        resolve(outputPath);

      })



      .on("error", (err) => {

        console.log(
          "\nFFMPEG ERROR:\n"
        );

        console.log(err);

        reject(err);

      })



      .save(outputPath);

  });

}

module.exports = renderVideo;