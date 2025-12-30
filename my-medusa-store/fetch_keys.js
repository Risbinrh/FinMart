const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://medusa_user:2112@localhost:5433/finmart',
});

async function run() {
    try {
        await client.connect();

        const keys = await client.query("SELECT * FROM api_key WHERE type = 'publishable'");
        console.log('--- KEYS START ---');
        console.log(JSON.stringify(keys.rows, null, 2));
        console.log('--- KEYS END ---');

        const regions = await client.query("SELECT * FROM region");
        console.log('--- REGIONS START ---');
        console.log(JSON.stringify(regions.rows, null, 2));
        console.log('--- REGIONS END ---');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
