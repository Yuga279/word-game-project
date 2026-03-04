import pkg from 'pg';
const { Client } = pkg;

async function testPublic() {
    console.log('Testing connection to RNAcentral Public DB...');
    const client = new Client({
        host: "hh-pgsql-public.ebi.ac.uk",
        port: 5432,
        database: "pfmegrnargs",
        user: "reader",
        password: "NWDMCE5xdipIjRrp",
        // RNAcentral might not require SSL, but let's try without first
        ssl: false
    });

    try {
        await client.connect();
        console.log('SUCCESS: Connected to Public Postgres!');
        const res = await client.query('SELECT COUNT(*) FROM rna');
        console.log('RNA Count:', res.rows[0].count);
        await client.end();
    } catch (err: any) {
        console.log('Public DB Error:', err.message);
        // If it fails with SSL required, try with SSL
        if (err.message.includes('SSL')) {
            console.log('Retrying with SSL...');
            const clientSSL = new Client({
                host: "hh-pgsql-public.ebi.ac.uk",
                port: 5432,
                database: "pfmegrnargs",
                user: "reader",
                password: "NWDMCE5xdipIjRrp",
                ssl: { rejectUnauthorized: false }
            });
            await clientSSL.connect();
            console.log('SUCCESS with SSL!');
            await clientSSL.end();
        }
    }
}

testPublic();
