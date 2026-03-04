import knex from 'knex';
import config from './knexfile.ts';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    console.log('Starting manual migration...');
    const db = knex(config.development);
    try {
        console.log('Running migrate:latest...');
        const [batchNo, log] = await db.migrate.latest();
        if (log.length === 0) {
            console.log('Already up to date');
        } else {
            console.log('Batch', batchNo, 'ran', log.length, 'migrations:', log.join(', '));
        }

        console.log('Running seed:run...');
        const [seedLog] = await db.seed.run();
        console.log('Seed ran successfully:', seedLog);

    } catch (err: any) {
        console.error('Migration/Seed Error:', err);
        process.exit(1);
    } finally {
        await db.destroy();
    }
}

run();
