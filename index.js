// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }
const app = require("./app");
const newCard = require ("./new_card");
// const homeView = require("./home-view");

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
  app.command('/valentinescard', newCard)

})();
