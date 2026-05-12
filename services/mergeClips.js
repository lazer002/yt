const ffmpeg = require("fluent-ffmpeg");

const ffmpegPath =
  require("ffmpeg-static");

const ffprobe =
  require("ffprobe-static");

const fs = require("fs");

const path = require("path");

ffmpeg.setFfmpegPath(ffmpegPath);

ffmpeg.setFfprobePath(ffprobe.path);



async function mergeClips(clips) {

  return new Promise((resolve, reject) => {

    console.log(
      "\n========== MERGING STARTED ==========\n"
    );



    const outputPath = path.join(

      __dirname,

      `../videos/merged-${Date.now()}.mp4`

    );



    // CREATE CONCAT FILE
    const fileListPath = path.join(

      __dirname,

      "../videos/filelist.txt"

    );



    // BUILD FILE LIST
    const fileContent = clips

      .map((clip) => {

        // IMPORTANT FOR WINDOWS PATHS
        const normalized =
          clip.replace(/\\/g, "/");

        return `file '${normalized}'`;

      })

      .join("\n");



    fs.writeFileSync(
      fileListPath,
      fileContent
    );



    ffmpeg()

      .input(fileListPath)

      .inputOptions([

        "-f concat",

        "-safe 0"

      ])



      .outputOptions([

        "-c:v libx264",

        "-preset ultrafast",

        "-crf 32",

        "-pix_fmt yuv420p"

      ])



      .on("start", (cmd) => {

        console.log(
          "☁ Render-safe merge started\n"
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

          `🎬 Merge Progress: ${percent}%`

        );

      })



      .on("end", () => {

        console.log(

          "\n\n✅ Merge completed\n"

        );



        // CLEAN FILELIST
        if (fs.existsSync(fileListPath)) {

          fs.unlinkSync(fileListPath);

        }



        resolve(outputPath);

      })



      .on("error", (err) => {

        console.log(
          "\n❌ MERGE ERROR:\n"
        );

        console.log(err);



        reject(err);

      })



      .save(outputPath);

  });

}



module.exports = mergeClips;