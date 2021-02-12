const { App, ExpressReceiver } = require('@slack/bolt');

const database = require("./database");
// const stats = require("./stats/stats");

const sentCardTemplate = require("./templates/sent_card_template");
const chooseImageTemplate = require("./templates/choose_image_template");
const confirmImageTemplate = require("./templates/confirm-image-template");
const newCardTemplate = require("./templates/new_card_template");
const homeTemplate = require('./templates/home_template');

let homeView;

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: '/slack/events',
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

openModal = async({ body, client }) => {
  try {
    homeView = await client.views.open({
      trigger_id: body.trigger_id,
      view: newCardTemplate(),
    });
  }
  catch (error) {
    console.error(error);
  }
  database().addInitialCard(body.user_id || body.user?.id);
}

// COMMANDS
app.command('/carte-de-saint-valentin', async ({ ack, body, client }) => {
  await ack();
  openModal({ body, client });
});

// VIEWS
app.view({ callback_id: 'new_card_modal', type: 'view_submission' }, async ({ ack, body, client }) => {
  try {
    await database().getLastUpdatedCardFromUser(body.user.id).then( async (data) => {
      newCardFromBD = data[0];

      if (newCardFromBD.receiver_id && newCardFromBD.image && newCardFromBD.text) {
        await ack();
        await client.users.profile.get({ user: newCardFromBD.sender_id }).then( async (currentUser) => {
          newCardFromBD.sender = currentUser.profile.real_name_normalized;

          await client.users.profile.get({ user: newCardFromBD.receiver_id }).then( async (currentUser) => {
            newCardFromBD.receiver = currentUser.profile.real_name_normalized;

            await client.chat.postMessage({
              channel: newCardFromBD.receiver_id,
              blocks: sentCardTemplate(newCardFromBD.receiver, newCardFromBD.sender, newCardFromBD.image, newCardFromBD.text),
            });
            // await database().addCardToStats(newCard).then((output) => {
            //   console.log(output);
            // });
          }, (err) => {
            console.log(err)
          });
        }, (err) => {
          console.log(err)
        });
      } else {
        try {
          await ack({
            response_action: 'errors',
            errors: {
              'block_image': 'Vous devez remplir tous les champs'
            }
          });

          await client.views.update({
            view_id: homeView.view.id,
            trigger_id: body.trigger_id,
            view: newCardTemplate(true),
          });
        } catch(error) {
          console.log(error);
        }
      }
    });

  } catch (error) {
    console.error(error);
  }
});

app.view({ callback_id: 'confirm_image_modal', type: 'view_closed' }, async ({ ack, body, view, client }) => {
  await ack();

  try {
    database().getLastUpdatedCardFromUser(body.user.id).then(async(data) => {
      newCardFromBD = data[0];
      const result = await client.views.update({
        view_id: homeView.view.id,
        trigger_id: body.trigger_id,
        view: newCardTemplate(false, newCardFromBD.image),
      });
    });
  } catch(error) {
    console.log(error);
  }
});

// ACTIONS
app.action('users_select-action', async ({ ack, body, client }) => {
  await ack();
  try {
    const senderId = body.user?.id;
    const selectedUserId = body['actions'][0]['selected_user'];
    database().updateRecipient(senderId, selectedUserId);
  }
  catch (error) {
    console.error(error);
  }
});

app.action('plain_text_input-action', async ({ ack, body }) => {
  await ack();
  try {
    database().updateMessage(body.user?.id, body['actions'][0]['value']);
  }
  catch (error) {
    console.error(error);
  }
});

app.action('choose_image-action', async ({ ack, body, client }) => {
  await ack();
  try {
    await client.views.push({
      trigger_id: body.trigger_id,
      view: chooseImageTemplate(),
    });
  }
  catch (error) {
    console.error(error);
  }
});

app.action('carte-action', async ({ ack, body, client }) => {
  await ack();
  try {
    database().updateImage(body.user?.id, body.actions[0].value).then( async () => {
      const result = await client.views.update({
        view_id: body.view.id,
        trigger_id: body.trigger_id,
        hash: body.view.hash,
        view: confirmImageTemplate(body.actions[0].value),
      });
    });


  } catch (error) {
    console.log(error);
  }
});

app.action('open_modal-action', async ({ ack, body, client }) => {
  await ack();
  openModal({ body, client });
});

// EVENTS
app.event('app_home_opened', async ({ event, client }) => {
  try {
    const result = await client.views.publish({
      user_id: event.user,
      view: homeTemplate(event.user)
    });
  }
  catch (error) {
    console.error(error);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  // stats(database, receiver.router, app.client);
  console.log('⚡️ Bolt app is running!');
})();
