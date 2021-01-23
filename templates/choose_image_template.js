module.exports = () => {

  addButton = (image) => {
    return {
      "type": "actions",
      "block_id": image.name + '-button',
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Choisir cette image :arrow_down:",
            "emoji": true
          },
          "value": image.url,
          "action_id": "carte-action"
        }
      ]
    }
  };

  const images = [
    {
      name: 'carte1',
      url: 'https://i.imgur.com/UfrJSSY.jpeg'
    },
    {
      name: 'carte2',
      url: 'https://i.imgur.com/UfrJSSY.jpeg'
    },
    {
      name: 'carte3',
      url: 'https://i.imgur.com/UfrJSSY.jpeg'
    }
  ];

  const imageBlocks = [];
  images.forEach(image => {
    imageBlocks.push(
      addButton(image),
      {
        "type": "image",
        "block_id": image.name,
        "image_url": image.url,
        "alt_text": image.name
      }
    );
  });

  return {
    "type": "modal",
    "callback_id": 'choose_image_modal',
    "title": {
      "type": "plain_text",
      "text": "Choisir l'image",
      "emoji": true
    },
    "blocks":  imageBlocks,
  }

}
