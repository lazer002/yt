const fs = require("fs");
const readline = require("readline");
const path = require("path");

const open =
  (...args) =>
    import("open")
      .then(mod => mod.default(...args));

const { google } = require("googleapis");

const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
];

const TOKEN_PATH =
  path.join(__dirname, "../token.json");

const CREDENTIALS_PATH =
  path.join(
    __dirname,
    "../client_secret.json"
  );

async function authorize() {

  const content =
    fs.readFileSync(CREDENTIALS_PATH);

  const credentials =
    JSON.parse(content);

  const {
    client_secret,
    client_id,
    redirect_uris,
  } = credentials.installed;

  const oAuth2Client =
    new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

  // TOKEN EXISTS
  if (fs.existsSync(TOKEN_PATH)) {

    const token =
      fs.readFileSync(TOKEN_PATH);

    oAuth2Client.setCredentials(
      JSON.parse(token)
    );

    return oAuth2Client;
  }

  // AUTH URL
  const authUrl =
    oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });

  console.log(
    "\nOPEN THIS URL:\n"
  );

  console.log(authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code =
    await new Promise((resolve) => {

      rl.question(
        "\nPaste the code here:\n",
        resolve
      );

    });

  rl.close();

  const { tokens } =
    await oAuth2Client.getToken(code);

  oAuth2Client.setCredentials(tokens);

  fs.writeFileSync(
    TOKEN_PATH,
    JSON.stringify(tokens)
  );

  console.log(
    "\nTOKEN SAVED\n"
  );

  return oAuth2Client;
}

async function uploadYoutube(
  videoPath,
  title,
  description,
  tags
) {

  const auth =
    await authorize();

  const youtube =
    google.youtube({
      version: "v3",
      auth,
    });

  const response =
    await youtube.videos.insert({

      part: "snippet,status",

      requestBody: {

        snippet: {
          title,
          description,
          tags,
          categoryId: "28",
        },

        status: {
          privacyStatus: "public",
        },
      },

      media: {
        body:
          fs.createReadStream(videoPath),
      },
    });

  console.log(
    "\nUPLOAD SUCCESSFUL\n"
  );

  console.log(response.data);

}

module.exports = uploadYoutube;