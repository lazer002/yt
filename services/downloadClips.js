const axios = require("axios");

const fs = require("fs");

const path = require("path");

const trimClip =
  require("./trimClip");

const {
  getAudioDurationInSeconds
} = require("get-audio-duration");



async function downloadSingleClip(
  keyword,
  index,
  audioPath
) {

  try {

    console.log(
      `Searching clip for: ${keyword}`
    );



    const response = await axios.get(

      `https://api.pexels.com/videos/search?query=${keyword}&per_page=5`,

      {
        headers: {
          Authorization:
            process.env.PEXELS_API_KEY,
        },
      }
    );



    if (!response.data.videos.length) {

      throw new Error(
        `No videos found for ${keyword}`
      );

    }



    // RANDOM VIDEO
    const randomVideo =

      response.data.videos[
        Math.floor(
          Math.random() *
          response.data.videos.length
        )
      ];



    // USE SD FOR SPEED
    const videoFile =

      randomVideo.video_files.find(
        file => file.quality === "sd"
      ) ||

      randomVideo.video_files[0];



    const videoUrl = videoFile.link;



    console.log(
      `Downloading raw clip...`
    );



    const videoResponse = await axios({

      method: "GET",

      url: videoUrl,

      responseType: "stream",

    });



    // RAW FILE
    const rawPath = path.join(

      __dirname,

      `../videos/raw-${index}.mp4`

    );



    const writer =
      fs.createWriteStream(rawPath);

    videoResponse.data.pipe(writer);



    await new Promise((resolve, reject) => {

      writer.on("finish", resolve);

      writer.on("error", reject);

    });



    console.log(
      `Raw clip downloaded: ${rawPath}`
    );



    // GET AUDIO DURATION
    const duration =

      await getAudioDurationInSeconds(
        audioPath
      );



    console.log(
      `Scene audio duration: ${duration}`
    );



    // TRIMMED FILE
    const trimmedPath = path.join(

      __dirname,

      `../videos/scene-${index}.mp4`

    );



    console.log(
      `Trimming clip to ${Math.ceil(duration)} seconds...`
    );



    // TRIM CLIP
    await trimClip(

      rawPath,

      trimmedPath,

      duration

    );



    console.log(
      `Trimmed clip saved: ${trimmedPath}`
    );



    // IMPORTANT
    return trimmedPath;

  } catch (error) {

    console.log(
      `ERROR downloading ${keyword}`
    );

    console.log(error.message);

    return null;
  }
}



async function downloadClips(
  scenes,
  audioPaths
) {

  const clipPaths = [];



  for (let i = 0; i < scenes.length; i++) {

    const scene = scenes[i];



    const clip =
      await downloadSingleClip(

        scene.keyword,

        i,

        audioPaths[i]

      );



    if (clip) {

      clipPaths.push(clip);

    }

  }



  return clipPaths;
}

module.exports = downloadClips;