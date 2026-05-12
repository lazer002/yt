
const express = require("express");

const router = express.Router();

require("dotenv").config();




// SERVICES
const uploadYoutube =
  require("../services/uploadYoutube");

const generateScript =
  require("../services/generateScript");

const generateVoice =
  require("../services/generateVoice");

const downloadClips =
  require("../services/downloadClips");

const generateSubtitles =
  require("../services/generateSubtitles");

const renderVideo =
  require("../services/renderVideo");

const generateMetadata =
  require("../services/generateMetadata");

const extractScenes =
  require("../services/extractScenes");

const mergeClips =
  require("../services/mergeClips");

const mergeAudio =
  require("../services/mergeAudio");

const cleanup =
  require("../services/cleanup");
  
const generateTopic = require("../services/generateTopic");

router.get(
  "/run",
  async (req, res) => {
  try {

    console.log(
      "STEP 1 → Starting worker...\n"
    );



    // TOPICS
const topic =
  await generateTopic();


    console.log(
      `TOPIC: ${topic}`
    );



    // GENERATE SCRIPT
    const script =
      await generateScript(topic);

    console.log(
      "\nSTEP 2 → Script generated\n"
    );

    console.log(script);


    if (!script) {

      console.log(
        "\n❌ Script generation failed\n"
      );

      return;
    }



    // EXTRACT SCENES
    console.log(
      "\nSTEP 3 → Extracting scenes...\n"
    );

    let scenes =
      extractScenes(script);

    console.log(scenes);


    // LIMIT SCENES
    if (scenes.length > 8) {

      scenes = scenes.slice(0, 8);

    }


    if (!scenes.length) {

      console.log(
        "\n❌ No scenes extracted\n"
      );

      return;
    }



    // GENERATE SCENE VOICES FIRST
    console.log(
      "\nSTEP 4 → Generating scene voices...\n"
    );

    const audioPaths = [];

    for (let i = 0; i < scenes.length; i++) {

      const scene = scenes[i];

      const audio = await generateVoice(

        scene.text,

        i

      );

      if (audio) {

        audioPaths.push(audio);

      }

    }

    console.log(
      "\nAUDIO PATHS:\n"
    );

    console.log(audioPaths);


    if (!audioPaths.length) {

      console.log(
        "\n❌ Voice generation failed\n"
      );

      return;
    }



    // DOWNLOAD + TRIM CLIPS
    console.log(
      "\nSTEP 5 → Downloading and trimming clips...\n"
    );

    const clips = await downloadClips(

      scenes,

      audioPaths

    );

    console.log(
      "\nDOWNLOADED TRIMMED CLIPS:\n"
    );

    console.log(clips);


    if (!clips.length) {

      console.log(
        "\n❌ No clips downloaded\n"
      );

      return;
    }



    // MERGE CLIPS
    console.log(
      "\nSTEP 6 → Merging clips...\n"
    );

    const mergedVideo =
      await mergeClips(clips);

    console.log(
      "\nMERGED VIDEO:\n"
    );

    console.log(mergedVideo);


    if (!mergedVideo) {

      console.log(
        "\n❌ Clip merge failed\n"
      );

      return;
    }



    // MERGE AUDIO
    console.log(
      "\nSTEP 7 → Merging audio...\n"
    );

    const finalAudio =
      await mergeAudio(audioPaths);

    console.log(
      "\nFINAL AUDIO:\n"
    );

    console.log(finalAudio);



    // GENERATE SUBTITLES
    console.log(
      "\nSTEP 8 → Generating subtitles...\n"
    );

    const subtitlePath =
      await generateSubtitles(script);

    console.log(
      "\nSUBTITLE PATH:\n"
    );

    console.log(subtitlePath);


    if (!subtitlePath) {

      console.log(
        "\n❌ Subtitle generation failed\n"
      );

      return;
    }



    // RENDER FINAL VIDEO
    console.log(
      "\nSTEP 9 → Rendering final video...\n"
    );

    const finalVideo =
      await renderVideo(

        mergedVideo,

        subtitlePath,

        finalAudio,

        topic

      );

    console.log(
      "\nFINAL VIDEO:\n"
    );

    console.log(finalVideo);


    if (!finalVideo) {

      console.log(
        "\n❌ Video render failed\n"
      );

      return;
    }



    // GENERATE METADATA
    console.log(
      "\nSTEP 10 → Generating metadata...\n"
    );

    const metadata =
      await generateMetadata(topic);

    console.log(metadata);



    // UPLOAD TO YOUTUBE
    console.log(
      "\nSTEP 11 → Uploading to YouTube...\n"
    );

    await uploadYoutube(

      finalVideo,

      `${metadata.title} #shorts`,

      metadata.description,

      metadata.tags

    );



    console.log(
      "\n✅ YOUTUBE UPLOAD COMPLETE\n"
    );
      await cleanup();
    console.log(
      "\n✅ PIPELINE SUCCESSFUL\n"
    );

return res.json({

  success: true,

  message:
    "Video uploaded successfully",

  topic,

  title: metadata.title

});

  } catch (error) {

    console.log(
      "\n=========== MAIN ERROR ===========\n"
    );

    console.log(error);

    console.log(
      "\n==================================\n"
    );

  }

}
)

module.exports = router;

