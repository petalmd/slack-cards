const { Pool } = require('pg');

module.exports = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/slackcards',
    ssl: {
      rejectUnauthorized: false,
    }
    // ssl: process.env.DATABASE_URL ? true : false
  });

  return {
    addCardToStats: async (newCard)  => {
      try {
        const client = await pool.connect();

        const now = new Date()
        const insertText = 'INSERT INTO cards(sender_id, receiver_id, sent_on) VALUES ($1, $2, $3)';
        let result = await client.query(insertText, [newCard.senderId, newCard.recipientId, now])

        client.release();
        return result;
      } catch (err) {
        return err;
      }
    },
    getMostPopularRecipient: async () => {
      try {
        const client = await pool.connect();
        result = await client.query(`
          SELECT * FROM
          (SELECT receiver_id, count(*) FROM cards
          GROUP BY receiver_id
          ORDER BY count desc) AS groupByReceiver
          `);
        return { 'results': (result) ? result.rows : null};
      } catch (err) {
        return err;
      }
    },
    getMostProlificSender: async () => {
      try {
        const client = await pool.connect();
        result = await client.query(`
          SELECT * FROM
          (SELECT sender_id, count(*) FROM cards
          GROUP BY sender_id
          ORDER BY count desc) AS groupBySender
          `);
        return { 'results': (result) ? result.rows : null};
      } catch (err) {
        return err;
      }
    }
  }
}