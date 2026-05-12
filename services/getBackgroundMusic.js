const path = require("path");

function getBackgroundMusic(topic) {

  const lowerTopic =
    topic.toLowerCase();



  // HORROR
  if (

    lowerTopic.includes("डर") ||

    lowerTopic.includes("हॉरर") ||

    lowerTopic.includes("खतरनाक") ||

    lowerTopic.includes("भूत")

  ) {

    return path.join(
      __dirname,
      "../music/horror.mp3"
    );

  }



  // SPACE / SCI-FI
  if (

    lowerTopic.includes("अंतरिक्ष") ||

    lowerTopic.includes("स्पेस") ||

    lowerTopic.includes("ब्लैक होल") ||

    lowerTopic.includes("ai") ||

    lowerTopic.includes("भविष्य")

  ) {

    return path.join(
      __dirname,
      "../music/sci-fi.mp3"
    );

  }



  // MYTHOLOGY
  if (

    lowerTopic.includes("महाभारत") ||

    lowerTopic.includes("रामायण") ||

    lowerTopic.includes("कृष्ण") ||

    lowerTopic.includes("भगवान")

  ) {

    return path.join(
      __dirname,
      "../music/mythology.mp3"
    );

  }



  // PSYCHOLOGY
  if (

    lowerTopic.includes("साइकोलॉजी") ||

    lowerTopic.includes("मानव") ||

    lowerTopic.includes("दिमाग")

  ) {

    return path.join(
      __dirname,
      "../music/psychology.mp3"
    );

  }



  // MOTIVATION
  if (

    lowerTopic.includes("सफल") ||

    lowerTopic.includes("मोटिवेशन") ||

    lowerTopic.includes("करोड़पति")

  ) {

    return path.join(
      __dirname,
      "../music/motivation.mp3"
    );

  }



  // DEFAULT MYSTERY
  return path.join(
    __dirname,
    "../music/mystery.mp3"
  );

}

module.exports = getBackgroundMusic;