"""Insert one batch at a time to locate failing batch."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import psycopg2
from psycopg2.extras import execute_values

from upload import (
    BATCH_SIZE,
    DATABASE_URL,
    INSERT_SQL,
    resolve_csv_path,
    sanitize_dataframe,
    rows_from_dataframe,
)
import pandas as pd

csv_path = resolve_csv_path()
df = pd.read_csv(csv_path, dtype=str, keep_default_na=False, na_values=[""])
df = sanitize_dataframe(df)
rows = rows_from_dataframe(df)

conn = psycopg2.connect(DATABASE_URL)
conn.autocommit = True

with conn.cursor() as cur:
    cur.execute("TRUNCATE players")

for batch_num, start in enumerate(range(0, len(rows), BATCH_SIZE)):
    batch = rows[start : start + BATCH_SIZE]
    try:
        with conn.cursor() as cur:
            execute_values(cur, INSERT_SQL, batch, page_size=len(batch))
        print(f"Batch {batch_num} OK (rows {start}-{start+len(batch)})")
    except Exception as e:
        print(f"Batch {batch_num} FAILED at rows {start}-{start+len(batch)}: {e}")
        # binary search within batch
        for i, row in enumerate(batch):
            try:
                with conn.cursor() as cur:
                    execute_values(cur, INSERT_SQL, [row], page_size=1)
            except Exception as row_e:
                print(f"  Bad row index {start+i}, player_id={row[0]}: {row_e}")
        break

with conn.cursor() as cur:
    cur.execute("SELECT COUNT(*) FROM players")
    print("Count:", cur.fetchone()[0])

conn.close()
