const { App, ExpressReceiver } = require('@slack/bolt');

const database = require("./database");
const stats = require("./stats/stats");

const sentCardTemplate = require("./templates/sent_card_template");
const chooseImageTemplate = require("./templates/choose_image_template");
const confirmImageTemplate = require("./templates/confirm-image-template");
const newCardTemplate = require("./templates/new_card_template");
const homeTemplate = require('./templates/home_template');

let homeView;

let newCard = {
  recipient: null,
  recipientId: null,
  sender: null,
  senderId: null,
  image: null,
  message: null,
};

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: '/slack/events',
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.STATE_SECRET,
  scopes: ['channels:history', 'commands', 'groups:history', 'im:history', 'chat:write', 'users.profile:read'],
});

openModal = async({ body, client }) => {
  newCard.image = null;
  try {
    homeView = await client.views.open({
      trigger_id: body.trigger_id,
      view: newCardTemplate(),
    });
  }
  catch (error) {
    console.error(error);
  }

  newCard.senderId = body.user_id || body.user?.id;
  client.users.profile.get({ user: newCard.senderId }).then((currentUser) => {
    newCard.sender = currentUser.profile.real_name_normalized;
  }, (err) => {
    console.log(err)
  });
}

// COMMANDS
app.command('/carte-de-saint-valentin', async ({ ack, body, client }) => {
  await ack();
  openModal({ body, client });
});

// VIEWS
app.view({ callback_id: 'new_card_modal', type: 'view_submission' }, async ({ ack, body, client }) => {
  if (!!newCard.image && newCard.image.length > 10) {
    await ack();

    try {
      console.log(newCard);
      await client.chat.postMessage({
        channel: newCard.recipientId,
        blocks: sentCardTemplate(newCard.recipient, newCard.sender, newCard.image, newCard.message),
      });
      await database().addCardToStats(newCard).then((output) => {
        console.log(output);
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      await ack({
        response_action: 'errors',
        errors: {
          'block_image': 'Vous devez sélectionner une image'
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

app.view({ callback_id: 'confirm_image_modal', type: 'view_closed' }, async ({ ack, body, view, client }) => {
  await ack();

  try {
    newCard.image = view.blocks[1].image_url;
    const result = await client.views.update({
      view_id: homeView.view.id,
      trigger_id: body.trigger_id,
      view: newCardTemplate(false, newCard.image),
    });
  } catch(error) {
    console.log(error);
  }
});

// ACTIONS
app.action('users_select-action', async ({ ack, body, client }) => {
  await ack();
  try {
    const selectedUserId = body['actions'][0]['selected_user'];

    client.users.profile.get({ user: selectedUserId }).then((selectedUser) => {
      newCard.recipient = selectedUser.profile.real_name_normalized;
      newCard.recipientId = selectedUserId;
    }, (err) => {
      console.log(err)
    });

  }
  catch (error) {
    console.error(error);
  }
});

app.action('plain_text_input-action', async ({ ack, body }) => {
  await ack();
  try {
    newCard.message = body['actions'][0]['value'];
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
    const result = await client.views.update({
      view_id: body.view.id,
      trigger_id: body.trigger_id,
      hash: body.view.hash,
      view: confirmImageTemplate(body.actions[0].value),
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

    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  stats(database, receiver.router, app.client);
  console.log(app);
  console.log('⚡️ Bolt app is running!');
})();
