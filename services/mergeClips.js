const ffmpeg = require("fluent-ffmpeg");

const ffmpegPath =
  require("ffmpeg-static");
const ffprobe =
  require("ffprobe-static");
const path = require("path");

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobe.path);



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

    const outputPath = path.join(

      __dirname,

      `../videos/merged-${Date.now()}.mp4`

    );



    let command = ffmpeg();



    // ADD INPUTS
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



    // REMOVE LAST ;
    filter = filter.slice(0, -1);



    command

      .complexFilter(filter)



      .outputOptions([

        "-map",

        lastOutput,

        "-preset ultrafast",

        "-pix_fmt yuv420p"

      ])



      .videoCodec("libx264")



      .on("start", (cmd) => {

        console.log(
          "\n========== TRANSITION MERGE STARTED ==========\n"
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

  });

}

module.exports = mergeClips;