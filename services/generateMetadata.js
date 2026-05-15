const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function generateMetadata(topic) {

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

RETURN ONLY STRICT VALID JSON.

DO NOT:
- use markdown
- use code blocks
- add explanations
- add extra text

RETURN FORMAT:

{
  "title": "",
  "description": "",
  "tags": []
}

TITLE RULES:
- English only
- Maximum 70 characters
- Emotionally powerful
- Curiosity-driven
- Cinematic and viral
- Create suspense or emotional tension
- Make viewers unable to ignore
- Use psychological triggers:
  fear, mystery, shock, hidden truth, danger, impossible fact
- Add 1-2 relevant emojis naturally
- Avoid generic titles
- Avoid robotic wording
- Avoid spammy clickbait

GOOD TITLE STYLES:
- "NASA Is Hiding This Terrifying Secret 😨"
- "Nobody Survived Inside This Temple..."
- "Scientists Can't Explain This Mystery 😳"
- "This Place Should Not Exist 😨"

DESCRIPTION RULES:
- English only
- 2 to 4 short lines
- SEO optimized naturally
- Add emotional curiosity
- Mention topic keywords naturally
- Sound engaging and cinematic
- Encourage comments subtly
- Add MINIMUM 4 hashtags at the end
- Avoid keyword stuffing

DESCRIPTION EXAMPLE:
"Nobody knows what really happened here... 😨
Even scientists were shocked by this discovery.
Would you enter this place?

#shorts #mystery #facts #viral"

TAG RULES:
- Generate EXACTLY 5 tags
- English only
- Include:
  1 broad viral tag
  2 topic-specific tags
  1 emotional curiosity tag
  1 Shorts algorithm style tag
- Mix SEO + curiosity
- Avoid generic spam tags

TAG EXAMPLE:
[
  #shorts ,
#viralshorts,
#mystery,
#scaryfacts,
#hindishorts,
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

    let cleaned = text.trim();

    cleaned = cleaned

      .replace(/```json/g, "")
      .replace(/```/g, "")

      .replace(/\r/g, "")
      .replace(/\n/g, " ")
      .replace(/\t/g, " ")

      .replace(/\s+/g, " ")

      .trim();

    const jsonMatch =
      cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {

      throw new Error(
        "No valid JSON found"
      );

    }

    const metadata =
      JSON.parse(jsonMatch[0]);

    if (
      !metadata.title ||
      !metadata.description ||
      !Array.isArray(metadata.tags)
    ) {

      throw new Error(
        "Invalid metadata structure"
      );

    }

    return metadata;

  } catch (error) {

    console.log(
      "METADATA ERROR:"
    );

    console.log(error);

    return {

      title:
        "This Mystery Should Not Exist 😨",

      description:
        "Nobody can explain what really happened here...\n\n#shorts #viral #mystery #facts",

      tags: [
       #shorts ,
#viralshorts ,
#mystery,
#scaryfacts,
#hindishorts
      ]

    };

  }

}

module.exports =
  generateMetadata;