import json
import psycopg2

DATABASE_URL = (
    "postgresql://neondb_owner:npg_sOafq8vUZ9Sd@"
    "ep-nameless-term-alvfo0if-pooler.c-3.eu-central-1.aws.neon.tech/"
    "neondb?sslmode=require"
)

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

cur.execute("SELECT COUNT(*) FROM players")
print("Total players:", cur.fetchone()[0])

cur.execute(
    """
    SELECT player_id, short_name, player_positions, overall, potential,
           pace, shooting, club_name
    FROM players
    WHERE player_id = 210257
    """
)
print("\nGK sample (Ederson):")
print(json.dumps(dict(zip(
    ["player_id", "short_name", "player_positions", "overall", "potential",
     "pace", "shooting", "club_name"],
    cur.fetchone(),
)), indent=2))

cur.execute(
    """
    SELECT player_id, short_name, overall, potential, value_eur, club_name
    FROM players
    ORDER BY overall DESC
    LIMIT 5
    """
)
print("\nTop 5 by overall:")
for row in cur.fetchall():
    print(row)

cur.close()
conn.close()
