import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.DATABASE_URL;

async function tryConnect(useSSL: boolean) {
    const client = new Client({
        connectionString: url,
        ssl: useSSL ? { rejectUnauthorized: false } : false
    });
    try {
        console.log(`Trying ${useSSL ? 'SSL' : 'NO-SSL'}...`);
        await client.connect();
        console.log(`Success with ${useSSL ? 'SSL' : 'NO-SSL'}!`);
        await client.end();
        return true;
    } catch (err: any) {
        console.log(`Failed with ${useSSL ? 'SSL' : 'NO-SSL'}: ${err.message}`);
        return false;
    }
}

async function run() {
    await tryConnect(true);
    await tryConnect(false);
}

run();
