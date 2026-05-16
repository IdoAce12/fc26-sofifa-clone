import json
import psycopg2

DATABASE_URL = (
    "postgresql://neondb_owner:npg_sOafq8vUZ9Sd@"
    "ep-nameless-term-alvfo0if-pooler.c-3.eu-central-1.aws.neon.tech/"
    "neondb?sslmode=require"
)

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

cur.execute(
    """
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'players'
    ORDER BY ordinal_position
    """
)
print("Columns:")
print(json.dumps(cur.fetchall(), indent=2))

cur.execute("SELECT COUNT(*) FROM players")
print("Current row count:", cur.fetchone()[0])

cur.close()
conn.close()
