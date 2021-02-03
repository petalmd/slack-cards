module.exports = (error = false, imageUrl = null) => {
  const header = {
    "type": "header",
    "text": {
      "type": "plain_text",
      "text": "Envoyer une carte de Saint-Valentin :wave: :heart: :love_letter:",
      "emoji": true
    }
  };

  const subtitle = {
    "type": "section",
    "text": {
      "type": "plain_text",
      "text": "Ici vous pouvez envoyer des cartes de Saint-Valentin à vos collègues et amis. C'est presque pareil comme le courrier du cœur, mais sur Slack!",
    }
  };

  const divider = {
    "type": "divider"
  };

  const recipient = {
    "type": "section",
    "block_id": "block_recipient",
    "text": {
      "type": "mrkdwn",
      "text": "*Commencez par choisir un destinataire:*"
    },
    "accessory": {
      "type": "users_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Sélectionner",
        "emoji": true
      },
      "action_id": "users_select-action"
    }
  };

  const noImageChosen = [{
    "type": "section",
    "block_id": "block_image",
    "text": {
      "type": "mrkdwn",
      "text": "*Choisissez ensuite l'image de la carte*",
    },
  },
  {
    "type": "actions",
    "elements": [
      {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Voir les images",
          "emoji": true
        },
        "value": "choose_image",
        "action_id": "choose_image-action"
      }
    ]
  }];

  const imageChosen = [{
    "type": "section",
    "block_id": "block_image",
    "text": {
      "type": "mrkdwn",
      "text": "*Vous avez choisi cette image* \nPour changer votre sélection, cliquez sur _Choisir une autre image_ (vous ne perdrez pas vos modifications en changeant de page).",
    },
    "accessory": {
      "type": "image",
      "image_url": imageUrl,
      "alt_text": "Image choisie"
    }
  },
  {
    "type": "actions",
    "elements": [
      {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Choisir une autre image",
          "emoji": true
        },
        "value": "choose_image",
        "action_id": "choose_image-action"
      }
    ]
  }];

  const image = imageUrl?.length ? imageChosen : noImageChosen;

  const errorBlock = {
    "type": "context",
    "elements": [
      {
        "type": "plain_text",
        "text": ":warning: Vous devez sélectionner une image",
        "emoji": true
      }
    ]
  };

  const text = {
    "type": "input",
    "block_id": "block_message",
    "dispatch_action": true,
    "element": {
      "type": "plain_text_input",
      "multiline": true,
      "placeholder": {
        "type": "plain_text",
        "text": "Écrivez ici",
        "emoji": true
      },
      "min_length": 5,
      "max_length": 3000,
      "action_id": "plain_text_input-action",
      "dispatch_action_config": {
        "trigger_actions_on": ["on_character_entered"]
      }
    },
    "label": {
      "type": "plain_text",
      "text": "Finalement, écrivez un texte personnalisé",
      "emoji": true
    }
  };

  const blocks = [
    header,
    subtitle,
    recipient,
    divider,
    ...image,
    divider,
    text,
  ];

  if (error) {
    blocks.push(errorBlock);
    blocks;
  }

  return {
    "type": "modal",
    "callback_id": 'new_card_modal',
    "title": {
      "type": "plain_text",
      "text": "Nouvelle carte",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Envoyer :love_letter:",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Annuler",
      "emoji": true
    },
    "blocks": blocks
  };
};