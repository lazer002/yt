const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,

  baseURL: "https://api.groq.com/openai/v1",
});

async function generateScript(topic) {
  try {

    const completion =
      await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a viral YouTube Shorts writer.",
          },

          {
            role: "user",
content: `

You are an elite viral YouTube Shorts storyteller.

Your job is to create EXTREMELY addictive,
high-retention Hindi YouTube Shorts scripts
that maximize:
- watch time
- curiosity
- suspense
- emotional engagement
- replay value

TOPIC:
${topic}

GOAL:
The viewer should feel forced to keep watching.

IMPORTANT RULES:

- Hindi narration only
- Scene visual keywords MUST be in ENGLISH
- Build curiosity every 2-3 scenes
- End with a cliffhanger or open mystery
- Create EXACTLY 10 scenes
- Total video length: 45–60 seconds
- Every scene must feel visually different
- Avoid repetitive narration
- Every scene should escalate curiosity
- Use short punchy sentences
- No boring explanations
- No formal tone
- Vary narration pacing naturally
- Some scenes should be fast and shocking
- Some scenes should slow down for dramatic impact
- No intros like:
  "आज हम जानेंगे"
  "इस वीडियो में"
- Start immediately with a VIRAL HOOK

IMPORTANT:
Do NOT generate generic facts.
Every scene should feel emotionally cinematic and psychologically engaging.


HOOK REQUIREMENTS:
The FIRST scene MUST:
- create instant curiosity
- create emotional tension
- feel dangerous, shocking, mysterious, or unbelievable
- make viewer unable to scroll away

Use hook styles like:
- hidden truth
- forbidden secret
- fear
- countdown
- impossible fact
- shocking mystery
- conspiracy
- emotional twist

Examples:
- "NASA भी इससे डरता है..."
- "ये सच दुनिया से छुपाया गया..."
- "अगर ये सच है तो इंसान खतरे में हैं..."
- "महाभारत का ये रहस्य आज भी छुपाया जाता है..."

STORY FLOW:
Scene 1:
- Viral hook

Scene 2-4:
- build curiosity

Scene 5-7:
- reveal shocking facts

Scene 8-9:
- emotional/dramatic escalation

Scene 10:
- cliffhanger ending
- open mystery
- make viewer think

SCENE RULES:
Each scene MUST contain:
1. cinematic ENGLISH visual keyword
2. Hindi narration

VISUAL KEYWORD RULES:
- Prefer visually dynamic scenes with motion, action, or atmosphere
- Prefer realistic stock footage keywords
- Prefer cinematic camera-friendly visuals
- Avoid animated/cartoon/anime keywords
- Prefer real-world searchable footage
- ONLY ENGLISH
- cinematic
- searchable on Pexels
- visually descriptive
- 1 to 4 words maximum

GOOD:
[Scene: black hole]
[Scene: war battlefield]
[Scene: lord krishna]
[Scene: scary ocean]

BAD:
[Scene: interesting mystery happening]

RETENTION RULE:
Every 2 scenes should introduce a new curiosity gap,
surprising reveal, or emotional escalation.

NARRATION STYLE:
- cinematic
- emotional
- suspenseful
- dramatic
- conversational
- fast-paced

Ending should create one of:
- fear
- mystery
- emotional shock
- unanswered question
- impossible possibility

AVOID:
- overusing "क्या आप जानते हैं"
- repeating the same emotional tone
- repetitive suspense phrases
- repeated phrases
- robotic tone
- educational lecture style
- weak endings
- generic facts

RETURN FORMAT EXACTLY:

[Scene: visual keyword]
Narration text

[Scene: visual keyword]
Narration text

`
          },
        ],
      });

    return completion.choices[0].message.content;

  } catch (error) {

    console.log(
      "GROQ ERROR:"
    );

    console.log(error);

  }
}

module.exports = generateScript;