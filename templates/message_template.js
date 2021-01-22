module.exports = () => {
  const header = {
    "type": "plain_text",
    "text": "Envoyer une carte de Saint-Valentin :heart:",
    "emoji": true
  };

  const subtitle = {
    "type": "mrkdwn",
    "text": "Bonjour! Ici vous pourrez envoyer des cartes de Saint-Valentin à vos collègues et amis.\n"
  };

  const divider = {
    "type": "divider"
  };

  const recipient = {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*Commencez par choisir un destinataire:*"
    },
    "accessory": {
      "type": "users_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select a user",
        "emoji": true
      },
      "action_id": "users_select-action"
    }
  },

  const image = [{
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*Choisissez ensuite l'image de la carte*"
    }
  }];

  if (images.length) {
    image.push({
      type: "actions",
      elements: buttons,
    });
  }

  const blocks = [
    {
      "type": "header",
      "text": header,
    },
    {
      "type": "section",
      "text": subtitle,
    },
    {
      ...recipient
    },
    divider,
    ...image
  ];



  return blocks;
};