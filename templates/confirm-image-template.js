module.exports = (imageUrl) => {
  return {
    type: 'modal',
    callback_id: 'confirm_image_modal',
    notify_on_close: true,
    title: {
      type: 'plain_text',
      text: 'Image choisie'
    },
    close: {
      type: "plain_text",
      text: "Retour à la carte",
      emoji: true,
    },
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: 'Image choisie'
        }
      },
      {
        type: 'image',
        block_id: 'chosen_image',
        image_url: imageUrl,
        alt_text: 'Image choisie'
      }
    ]
  }
}
