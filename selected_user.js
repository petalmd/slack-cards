// module.exports = async () => {

//   app.action('users_select-action', async ({ ack, body, view }) => {
//     try {
//       await ack();
//       const selectedUser = await client.users.profile.get({
//         user: selectedUserId,
//       });
//       console.log(selectedUser);
//       return selectedUser;
//     }
//     catch (error) {
//       console.error(error);
//     }
//   });
// };