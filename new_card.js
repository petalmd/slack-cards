const app = require("./app");
const userService = require("./user_service");

const newCardTemplate = require("./templates/new_card_template");
const sentCardTemplate = require("./templates/sent_card_template");
const chooseImageTemplate = require("./templates/choose_image_template");
const confirmImageTemplate = require("./templates/confirm-image-template");

module.exports = async ({ ack, say, body, client }) => {
  await ack();
  const newCard = {
    recipient: null,
    recipientId: null,
    sender: null,
    image: null,
    message: 'NOPE',
  }

  let homeView;
  let imageView;

  try {
    // Call views.open with the built-in client
    homeView = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      view: newCardTemplate(),
    });
  }
  catch (error) {
    console.error(error);
  }

  userService(client).getUserById(body.user_id).then((currentUser) => {
    newCard.sender = currentUser.profile.real_name_normalized;
  }, (err) => {
    console.log(err)
  });

  // Handle a view_submission event
  app.view('new_card_modal', async ({ ack, body, view, client}) => {
    try {
      await ack();
      console.log(newCard);

      await client.chat.postMessage({
        channel: newCard.recipientId,
        blocks: sentCardTemplate(newCard.recipient, newCard.sender, 'https://images.martechadvisor.com/images/uploads/content_images/shutterstock_1286561869_1_5e381810ec99b.jpg', newCard.message),
      });
    }
    catch (error) {
      console.error(error);
    }
  });

  app.action('users_select-action', async ({ ack, body, view }) => {
    try {
      await ack();

      const selectedUserId = body['actions'][0]['selected_user'];

      userService(client).getUserById(selectedUserId).then((selectedUser) => {
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

  app.action('plain_text_input-action', async ({ ack, body, view }) => {
    await ack();
    try {
      newCard.message = body['actions'][0]['value'];
    }
    catch (error) {
      console.error(error);
    }
  });

  app.action('choose_image-action', async ({ ack, say, body }) => {
    await ack();
    try {
      imageView = await client.views.push({
        trigger_id: body.trigger_id,
        view: chooseImageTemplate(),
      });
    }
    catch (error) {
      console.error(error);
    }
  });

  app.view({ callback_id: 'confirm_image_modal', type: 'view_closed' }, async ({ ack, view }) => {
    await ack();
    try {
      newCard.image = view.blocks[1].image_url;
      // updater la new card template avec l'image
    } catch(error) {
      console.log(error);
    }
  });

  app.action('carte-action', async ({ ack, body, client }) => {
    await ack();
    try {
      const result = await client.views.update({
        view_id: body.view.id,
        trigger_id: body.trigger_id,
        hash: body.view.hash,
        view: confirmImageTemplate(),
      });
    } catch (error) {
      console.log(error);
    }
  });
};