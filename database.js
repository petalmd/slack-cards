const { Pool } = require('pg');

module.exports = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/cards',
    //ssl: {
    //  rejectUnauthorized: false,
    //}
    // ssl: process.env.DATABASE_URL ? true : false
  });

  return {
    addInitialCard: async (senderId) => {
      try {
        const client = await pool.connect();

        const now = new Date()
        const insertText = 'INSERT INTO cards(sender_id, updated_on) VALUES ($1, $2);';
        let result = await client.query(insertText, [senderId, now])
        client.release();
        return result;
      } catch (err) {
        return err;
      }
    },
    updateRecipient: async (senderId, receiverId) => {
      try {
        const client = await pool.connect();

        const now = new Date()
        const updateText = 'UPDATE cards SET receiver_id = $1, updated_on = $2 WHERE id = (SELECT * FROM(SELECT id FROM cards WHERE sender_id = $3 ORDER BY updated_on desc LIMIT 1) AS id);';
        let result = await client.query(updateText, [receiverId, now, senderId])

        client.release();
        return result;
      } catch (err) {
        return err;
      }
    },
    updateImage: async (senderId, image) => {
      try {
        const client = await pool.connect();

        const now = new Date()
        const updateText = 'UPDATE cards SET image = $1, updated_on = $2 WHERE id = (SELECT * FROM(SELECT id FROM cards WHERE sender_id = $3 ORDER BY updated_on desc LIMIT 1) AS id);';
        let result = await client.query(updateText, [image, now, senderId])

        client.release();
        return result;
      } catch (err) {
        return err;
      }
    },
    updateMessage: async (senderId, message) => {
      try {
        const client = await pool.connect();

        const now = new Date()
        const updateText = 'UPDATE cards SET text = $1, updated_on = $2 WHERE id = (SELECT * FROM(SELECT id FROM cards WHERE sender_id = $3 ORDER BY updated_on desc LIMIT 1) AS id);';
        let result = await client.query(updateText, [message, now, senderId])

        client.release();
        return result;
      } catch (err) {
        return err;
      }
    },
    getLastUpdatedCardFromUser: async (senderId) => {
      try {
        const client = await pool.connect();

        const now = new Date()
        const selectText = 'SELECT * FROM(SELECT * FROM cards WHERE sender_id = $1 ORDER BY updated_on desc LIMIT 1) AS lastUpdated;';
        let result = await client.query(selectText, [senderId])

        client.release();
        return result?.rows;
      } catch (err) {
        return err;
      }
    },
  }
}