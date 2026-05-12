const ffmpeg = require("fluent-ffmpeg");

const ffmpegPath =
  require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);

async function trimClip(
  inputPath,
  outputPath,
  duration
) {

  return new Promise((resolve, reject) => {

    ffmpeg(inputPath)



      // FORCE SAME SIZE
      .videoFilters([

        "scale=720:1280:force_original_aspect_ratio=increase",

        "crop=720:1280"

      ])



      // FORCE SAME FPS
      .fps(30)



      // FORCE SAME CODEC
      .videoCodec("libx264")



      // REMOVE AUDIO
      .noAudio()



      // IMPORTANT
      .outputOptions([

        `-t ${Math.ceil(duration)}`,

        "-preset ultrafast",

        "-pix_fmt yuv420p"

      ])



      .on("start", (cmd) => {

        console.log(
          "\nTRIM CMD:\n"
        );

        console.log(cmd);

      })



      .on("end", () => {

        console.log(
          `\n✅ Trimmed clip: ${outputPath}\n`
        );

        resolve(outputPath);

      })



      .on("error", (err) => {

        console.log(
          "\nTRIM ERROR:\n"
        );

        console.log(err);

        reject(err);

      })



      .save(outputPath);

  });

}

module.exports = trimClip;