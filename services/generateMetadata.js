const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,

  baseURL: "https://api.groq.com/openai/v1",
});


async function generateMetadata(
  topic
) {

  try {

    const response =
      await client.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        messages: [

          {
            role: "user",

content: `

You are an elite YouTube Shorts viral strategist.

Your job is to create HIGH-CTR,
emotionally irresistible YouTube Shorts metadata
optimized for:
- clicks
- retention
- curiosity
- replay value
- Shorts algorithm reach

TOPIC:
${topic}

IMPORTANT:
The metadata should feel like a REAL viral Shorts video,
not a boring educational upload.

RETURN ONLY VALID JSON:

{
  "title": "",
  "description": "",
  "tags": []
}

TITLE RULES:
- Hindi only
- Maximum 70 characters

- Emotionally powerful
- Curiosity-driven
- Sound cinematic and viral
- Create suspense or emotional tension
- Make viewers unable to ignore
- Use psychological triggers:
  fear, mystery, shock, hidden truth, danger, impossible fact
- Add 1-2 relevant emojis naturally
- Avoid generic titles
- Avoid robotic wording
- Avoid spammy clickbait
- Avoid:
  "Top 10 facts"
  "आज हम जानेंगे"
  "Interesting facts"

VIRAL OPTIMIZATION:
Study the style of high-performing viral YouTube Shorts.
Use tags commonly associated with viral Hindi Shorts content.
The metadata should feel similar to videos that get:
- millions of views
- high CTR
- high retention
- strong emotional reactions

Use viral YouTube Shorts psychology:
- curiosity gaps
- fear
- mystery
- emotional tension
- hidden truth
- impossible scenarios
- shocking reveals

GOOD TITLE STYLES:
- "NASA इस रहस्य से डरता है 😨"
- "महाभारत का ये सच छुपाया गया..."
- "अगर ये सच है तो इंसान खतरे में हैं 😳"
- "इस जगह इंसान 5 मिनट भी जिंदा नहीं रह सकता 😨"

TRENDING STYLE:
Use wording commonly seen in viral Shorts titles,
but keep it natural and cinematic.

DESCRIPTION RULES:
- Hindi only
- 2 to 4 short lines
- SEO optimized naturally
- Add emotional curiosity
- Mention topic keywords naturally
- Sound engaging and cinematic
- Encourage comments subtly
- Add relevant hashtags at the end
- Avoid keyword stuffing

DESCRIPTION STYLE EXAMPLE:
"क्या ये सच दुनिया से छुपाया गया था? 😨  
इस रहस्य ने वैज्ञानिकों को भी डरा दिया।  
#shorts #mystery #spacefacts"

TAG RULES:
- Generate EXACTLY 5 tags
- Hindi tags only
- Include:
  1 broad viral tag
  2 topic-specific tags
  1 emotional curiosity tag
  1 Shorts algorithm style tag
  Use tags commonly associated with viral Hindi Shorts content.
- Tags should resemble high-performing viral Shorts metadata
- Mix SEO + curiosity
- Avoid generic spam tags

TAG EXAMPLE:
[
  "स्पेस फैक्ट्स",
  "रहस्यमयी सच",
  "हिंदी शॉर्ट्स",
  "डरावने तथ्य",
  "वायरल शॉर्ट्स"
]

IMPORTANT:
Metadata should maximize CTR and curiosity,
not just explain the topic.

`
          }

        ],

      });

    const text =
      response.choices[0]
        .message.content;

const cleaned = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleaned);


  } catch (error) {

    console.log(
      "METADATA ERROR:"
    );

    console.log(error);

    return {

      title: topic,

      description: topic,

      tags: [
        "shorts",
        "viral"
      ]

    };

  }

}

module.exports =
  generateMetadata;