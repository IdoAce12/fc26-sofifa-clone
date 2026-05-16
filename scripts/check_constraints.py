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
    SELECT tc.constraint_type, kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
     AND tc.table_schema = kcu.table_schema
    WHERE tc.table_name = 'players'
    ORDER BY tc.constraint_type, kcu.ordinal_position
    """
)
print(json.dumps(cur.fetchall(), indent=2))

cur.close()
conn.close()
