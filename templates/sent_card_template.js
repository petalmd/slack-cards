module.exports = (userTo, userFrom, imageUrl, cardMessage) => {

  return [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "À: " + userTo,
        "emoji": true
      }
    },
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "De: " + userFrom,
        "emoji": true
      }
    },
    {
      "type": "image",
      "image_url": imageUrl,
      "alt_text": "image from love"
    },
    {
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": cardMessage,
        "emoji": true
      }
    }
  ];
};
