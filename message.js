module.exports = async ({ say, ack, body, client }) => {
  await ack();

  const newMessage = {
    recipient: body.user_id,
    image: body.image,
    message: 'allo helga',
  };


  await client.chat.postMessage({
    channel: body.user_id,
    text: message,
    // blocks: '',
  });

};