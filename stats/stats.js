function createTemplate(mostPopularRecipient, mostProlificSender) {
  let template = '<h1>Stats</h1>';
  template += '<p>Most popular recipient: ' + mostPopularRecipient  + '</p>';
  template += '<p>Most prolific sender: ' + mostProlificSender  + '</p>';

  return template;
}

module.exports = async(database, router, client) => {
  let mostPopularRecipient;

  await database().getMostPopularRecipient().then((data) => {
    mostPopularRecipient = data.results[0].receiver_id;
    client.users.profile.get({ token: process.env.SLACK_BOT_TOKEN, user: mostPopularRecipient }).then((user) => {
      mostPopularRecipient = user.profile.real_name_normalized;
    }, (err) => {
      console.log(err)
    });
  });

  await database().getMostProlificSender().then((data) => {
    mostProlificSender = data.results[0].sender_id;
    client.users.profile.get({ token: process.env.SLACK_BOT_TOKEN, user: mostProlificSender }).then((user) => {
      mostProlificSender = user.profile.real_name_normalized;
    }, (err) => {
      console.log(err)
    });
  });

  router.get('/stats', (req, res) => {
    res.send(createTemplate(mostPopularRecipient, mostProlificSender));
  });
}
