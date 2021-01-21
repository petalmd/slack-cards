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
    "block_id": "block_recipient",
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
  };

  const images = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Image 1"
      },
      "accessory": {
        "type": "image",
        "image_url": "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
        "alt_text": "cute cat"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Image 2"
      },
      "accessory": {
        "type": "image",
        "image_url": "https://www.smithsstationah.com/imagebank/eVetSites/Feline/01.jpg",
        "alt_text": "cute cat 2"
      }
    }
  ];

  const image = [{
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*Choisissez ensuite l'image de la carte*",
    }
  },
  ...images
  ];

  const text = {
    "type": "input",
    "block_id": "block_message",
    "dispatch_action": true,
    "element": {
      "type": "plain_text_input",
      "multiline": true,
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
    ...image,
    divider,
    text,
  ];

  return {
    "type": "modal",
    "callback_id": 'new_card_modal',
    "title": {
      "type": "plain_text",
      "text": "New card",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Send :love_letter:",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "blocks": blocks
  };
};