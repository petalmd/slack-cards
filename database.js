const { Pool } = require('pg');

module.exports = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/slackcards',
    // ssl: {
    //   rejectUnauthorized: false,
    // }
    ssl: process.env.DATABASE_URL ? true : false
  });

  return {
    addCardToStats: async (newCard)  => {
      try {
        const client = await pool.connect();

        const now = new Date()
        const insertText = 'INSERT INTO cards(sender_id, receiver_id, sent_on) VALUES ($1, $2, $3)';
        let result = await client.query(insertText, [newCard.senderId, newCard.recipientId, now])

        // result = await client.query('SELECT * FROM cards');
        // const results = { 'results': (result) ? result.rows : null};

        client.release();

        return result;
      } catch (err) {
        return err;
      }
    }
  }
}