const { Client } = require('pg');

const DATABASE_URL =
  'postgresql://neondb_owner:npg_sOafq8vUZ9Sd@ep-nameless-term-alvfo0if-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  const cols = await client.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'players'
    ORDER BY ordinal_position
  `);
  console.log('Columns:', JSON.stringify(cols.rows, null, 2));

  const count = await client.query('SELECT COUNT(*)::int AS count FROM players');
  console.log('Current row count:', count.rows[0].count);

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
