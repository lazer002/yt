const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,

  baseURL: "https://api.groq.com/openai/v1",
});


async function generateTopic() {

  try {

    const response =
      await client.chat.completions.create({

        model:
          "llama-3.3-70b-versatile",

        messages: [

          {
            role: "system",

            content:
              "You are an elite viral YouTube Shorts strategist."
          },



          {
            role: "user",
content: `

You are an elite viral YouTube Shorts strategist.

Your job is to generate ONE extremely viral
Hindi YouTube Shorts topic idea with
maximum scroll-stopping potential.

The topic must feel like a real viral Shorts idea
capable of getting:
- millions of views
- high CTR
- strong emotional reactions
- high retention
- comments and shares

IMPORTANT:
The topic should instantly create:
- curiosity
- suspense
- fear
- emotional tension
- shock
- mystery
- disbelief

The viewer should feel:
"I NEED to know this."

TOPIC CATEGORIES:
- mystery
- horror
- mythology
- psychology
- space
- AI
- hidden truths
- dangerous facts
- impossible places
- emotional stories
- conspiracy
- survival
- shocking science
- ancient secrets
- abandoned places
- black holes
- government secrets
- scary oceans
- unexplained mysteries
- dangerous creatures
- weird human behavior
- future predictions
- forbidden discoveries

RULES:
- Hindi only
- EXACTLY one topic
- One line only
- Maximum 8 words
- No numbering
- No quotation marks
- No hashtags
- No emojis
- Avoid generic educational topics
- Avoid boring wording
- Avoid formal language
- Avoid clickbait spam
- Make the topic emotionally irresistible
- Prefer emotionally charged wording
- Topic should sound cinematic and dangerous
- Topic should feel like a viral YouTube Shorts hook

PSYCHOLOGICAL TRIGGERS:
Use at least ONE:
- hidden truth
- forbidden secret
- impossible mystery
- fear
- conspiracy
- shocking fact
- dangerous possibility
- emotional shock
- survival tension
- unanswered question

GOOD EXAMPLES:
- NASA चाँद पर वापस क्यों नहीं गया?
- महाभारत का सबसे खतरनाक योद्धा
- इस जगह इंसान पागल हो जाते हैं
- AI इंसानों को खत्म कर सकता है?
- समुद्र के नीचे छुपी डरावनी चीज़
- ब्लैक होल में समय रुक जाता है?
- इस मंदिर में लोग गायब हो जाते हैं
- इंसान सपनों में ये चीज़ क्यों देखते हैं?
- दुनिया का सबसे डरावना समुद्र
- इस रहस्य से वैज्ञानिक भी डरते हैं

BAD EXAMPLES:
- अंतरिक्ष के रोचक तथ्य
- इतिहास की जानकारी
- विज्ञान के अद्भुत तथ्य
- जानवरों के बारे में जानकारी

IMPORTANT:
Generate a topic that feels:
- cinematic
- emotionally intense
- highly clickable
- highly discussable
- impossible to ignore

Generate ONLY the topic.
No explanation.

`
          }

        ]

      });



    return response
      .choices[0]
      .message.content
      .trim();

  } catch (err) {

    console.log(
      "TOPIC ERROR:"
    );

    console.log(err);

    return "डरावने अंतरिक्ष रहस्य";

  }

}

module.exports = generateTopic;