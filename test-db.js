const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
    .then(() => {
        console.log('Successfully connected to the database');
        return client.end();
    })
    .catch(err => {
        console.error('Connection error', err.stack);
        process.exit(1);
    });
