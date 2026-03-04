import pkg from 'pg';
const { Client } = pkg;

const connectionString = "postgresql://impostor_game_user:XBafNrC5OvJSU0QTS8HpL8T4erbD4qeG@dpg-d6ipevsr85hc7382743g.oregon-postgres.render.com/impostor_game";

async function test() {
    console.log('Testing direct PG connection with TLS options...');
    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false,
            minVersion: 'TLSv1.2'
        },
        connectionTimeoutMillis: 10000
    });

    try {
        await client.connect();
        console.log('SUCCESS: Connected to Render Postgres!');
        const res = await client.query('SELECT NOW()');
        console.log('Time from DB:', res.rows[0]);
        await client.end();
    } catch (err: any) {
        console.error('FAILURE:', err.message);
        if (err.stack) console.error(err.stack);
        process.exit(1);
    }
}

test();
