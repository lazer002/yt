const ffmpeg = require("fluent-ffmpeg");

const ffmpegPath =
  require("ffmpeg-static");

const ffprobe =
  require("ffprobe-static");

const path = require("path");

const fs = require("fs");



ffmpeg.setFfmpegPath(ffmpegPath);

ffmpeg.setFfprobePath(ffprobe.path);



// DETECT RENDER
const isRender =
  !!process.env.RENDER;



// GET VIDEO DURATION
function getClipDuration(clip) {

  return new Promise((resolve, reject) => {

    ffmpeg.ffprobe(

      clip,

      (err, metadata) => {

        if (err) {

          reject(err);

          return;

        }

        resolve(
          metadata.format.duration
        );

      }

    );

  });

}



async function mergeClips(clips) {

  return new Promise(async (resolve, reject) => {

    try {

      // CREATE VIDEOS FOLDER
      const videosDir = path.join(
        __dirname,
        "../videos"
      );



      if (!fs.existsSync(videosDir)) {

        fs.mkdirSync(videosDir, {
          recursive: true
        });

      }



      const outputPath = path.join(

        videosDir,

        `merged-${Date.now()}.mp4`

      );



      console.log(
        "\n========== MERGING STARTED ==========\n"
      );



      // =====================================
      // FAST CLOUD CONCAT (NO TRANSITIONS)
      // =====================================

      if (isRender) {

        console.log(
          "☁ Render detected → Using FAST concat merge\n"
        );



        const command = ffmpeg();



        clips.forEach((clip) => {

          command.input(clip);

        });



        let concatInputs = "";



        for (let i = 0; i < clips.length; i++) {

          concatInputs += `[${i}:v]`;

        }



        const filter =
          `${concatInputs}concat=n=${clips.length}:v=1:a=0[outv]`;



        command

          .complexFilter(filter)



          .outputOptions([

            "-map",

            "[outv]",

            "-preset ultrafast",

            "-crf 32",

            "-pix_fmt yuv420p"

          ])



          .videoCodec("libx264")



          .on("start", (cmd) => {

            console.log(cmd);

          })



          .on("progress", (progress) => {

            const percent = Math.floor(

              progress.percent || 0

            );



            process.stdout.clearLine(0);

            process.stdout.cursorTo(0);



            process.stdout.write(

              `⚡ Fast Merge: ${percent}%`

            );

          })



          .on("end", () => {

            console.log(

              "\n\n✅ Fast merge completed\n"

            );



            resolve(outputPath);

          })



          .on("error", (err) => {

            console.log(

              "\nMERGE ERROR:\n"

            );



            console.log(err);

            reject(err);

          })



          .save(outputPath);



        return;

      }



      // =====================================
      // LOCAL TRANSITION MERGE
      // =====================================

      console.log(
        "💻 Local mode → Using cinematic transitions\n"
      );



      let command = ffmpeg();



      clips.forEach((clip) => {

        command.input(clip);

      });



      // GET DURATIONS
      const durations = [];



      for (let i = 0; i < clips.length; i++) {

        const duration =
          await getClipDuration(clips[i]);



        durations.push(duration);

      }



      // BUILD XFADE FILTERS
      let filter = "";



      let lastOutput = "[0:v]";

      let offset = durations[0] - 1;



      for (let i = 1; i < clips.length; i++) {

        const output = `[v${i}]`;



        filter +=

          `${lastOutput}[${i}:v]` +

          `xfade=transition=fade:` +

          `duration=1:` +

          `offset=${offset}` +

          `${output};`;



        offset += durations[i] - 1;

        lastOutput = output;

      }



      filter = filter.slice(0, -1);



      command

        .complexFilter(filter)



        .outputOptions([

          "-map",

          lastOutput,

          "-preset ultrafast",

          "-crf 30",

          "-pix_fmt yuv420p"

        ])



        .videoCodec("libx264")



        .on("start", (cmd) => {

          console.log(cmd);

        })



        .on("progress", (progress) => {

          const percent = Math.floor(

            progress.percent || 0

          );



          process.stdout.clearLine(0);

          process.stdout.cursorTo(0);



          process.stdout.write(

            `🎬 Transition Merge: ${percent}%`

          );

        })



        .on("end", () => {

          console.log(

            "\n\n✅ Transition merge completed\n"

          );



          resolve(outputPath);

        })



        .on("error", (err) => {

          console.log(

            "\nMERGE ERROR:\n"

          );



          console.log(err);

          reject(err);

        })



        .save(outputPath);

    } catch (err) {

      reject(err);

    }

  });

}

module.exports = mergeClips;
