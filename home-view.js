app.event('app_home_opened', async ({ event, client }) => {
  try {
    // Call views.publish with the built-in client
    const result = await client.views.publish({
      // Use the user ID associated with the event
      user_id: event.user,
      view: {
        // Home tabs must be enabled in your app configuration page under "App Home"
        "type": "home",
        "callback_id": 'home_view',
        "blocks": [
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Envoyer une carte de Saint-Valentin :heart:",
              "emoji": true
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Bonjour! Ici vous pourrez envoyer des cartes de Saint-Valentin à vos collègues et amis.\n"
            }
          },
          {
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
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Choisissez ensuite l'image de la carte*"
            }
          },
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
            "type": "divider"
          },
          {
            "type": "input",
            "block_id": 'input_1',
            "element": {
              "type": "plain_text_input",
              "multiline": true,
              "action_id": "plain_text_input-action"
            },
            "label": {
              "type": "plain_text",
              "text": "Finalement, écrivez un texte personnalisé",
              "emoji": true
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Envoyer :love_letter:",
                  "emoji": true
                },
                "value": "click_me_123",
                "action_id": "send_letter"
              }
            ]
          }
        ]
      }
    });

    console.log(result);

    await client.chat.postMessage({
      channel: event.user,
      text: 'LALALAL'
    });
  }
  catch (error) {
    console.error(error);
  }
});