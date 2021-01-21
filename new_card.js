const app = require("./app");
const newCardTemplate = require("./new_card_template");
const sentCardTemplate = require("./sent_card_template");
const userService = require("./user_service");

module.exports = async ({ ack, say, body, client }) => {
  await ack();
  const newCard = {
    recipient: null,
    recipientId: null,
    sender: null,
    image: null,
    message: 'NOPE',
  }

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
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
    try {
      await ack();
      newCard.message = body['actions'][0]['value'];
    }
    catch (error) {
      console.error(error);
    }
  });

  // app.action('approve_button', async ({ ack, say }) => {
  //   try {
  //     await client.chat.postMessage({
  //       channel: newCard.recipient,
  //       text: newCard.message
  //     });
  //   }
  //   catch (error) {
  //     console.error(error);
  //   }
  // });
};