import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import util from 'util';
dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function test() {
    try {
        console.log('Connecting...');
        await client.connect();
        console.log('Connected!');
        await client.end();
    } catch (err) {
        console.error('Full Error Object:', util.inspect(err, { colors: true, depth: null }));
        process.exit(1);
    }
}

test();
