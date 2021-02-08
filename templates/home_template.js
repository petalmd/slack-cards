module.exports = (user) => {

  return {
    "type": "home",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Allô <@" + user + ">! :wave: :heart:"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Ici vous pouvez créer et envoyer des cartes de Saint-Valentin à n'importe quels de vos collègues! Vous pouvez utiliser à tout moment la commande `/carte-de-saint-valentin`, ou cliquer sur le bouton ci-dessous pour ouvrir la fenêtre de nouvelle carte.\n\n"
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Créer une nouvelle carte :love_letter:",
              "emoji": true
            },
            "value": "open_modal",
            "action_id": "open_modal-action"
          }
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Voici quelques trucs de pro pour écrire les meilleures cartes de Saint-Valentin*: \n- Pensez à quelque chose de gentil que vous pourriez dire à quelqu'un à qui vous parlez moins souvent :sunny:\n- Ça peut être l'occasion de contacter un collègue que vous avez perdu de vue depuis le télétravail :house_with_garden:\n- Tous les petits mots comptent! Il n'y a pas de maximum de cartes que vous pouvez envoyer :parrot_spaz:"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "mrkdwn",
            "text": "Si vous obtenez une erreur :warning: ou `dispatch_failed`, réessayez et tout devrait fonctionner (c'est ça qui arrive quand on est sur un serveur gratuit!). Si l'erreur persiste après quelques tentatives, vous pouvez écrire à @mabb"
          }
        ]
      }
    ]
  }
};
