"""
Migrate FC26 player data from CSV into Neon PostgreSQL `players` table.
Usage: python scripts/upload.py
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_sOafq8vUZ9Sd@"
    "ep-nameless-term-alvfo0if-pooler.c-3.eu-central-1.aws.neon.tech/"
    "neondb?sslmode=require",
)

BATCH_SIZE = 750

CSV_COLUMNS = [
    "player_id",
    "player_url",
    "short_name",
    "long_name",
    "player_positions",
    "overall",
    "potential",
    "value_eur",
    "wage_eur",
    "age",
    "height_cm",
    "weight_kg",
    "club_name",
    "league_name",
    "nationality_name",
    "preferred_foot",
    "weak_foot",
    "skill_moves",
    "player_face_url",
    "pace",
    "shooting",
    "passing",
    "dribbling",
    "defending",
    "physic",
    "player_traits",
    "player_tags",
]

INT_COLUMNS = [
    "player_id",
    "overall",
    "potential",
    "age",
    "height_cm",
    "weight_kg",
    "weak_foot",
    "skill_moves",
    "pace",
    "shooting",
    "passing",
    "dribbling",
    "defending",
    "physic",
]

FLOAT_COLUMNS = ["value_eur", "wage_eur"]

TEXT_COLUMNS = [
    "player_url",
    "short_name",
    "long_name",
    "player_positions",
    "club_name",
    "league_name",
    "nationality_name",
    "preferred_foot",
    "player_face_url",
    "player_traits",
    "player_tags",
]

INSERT_SQL = """
INSERT INTO players (
    player_id, player_url, short_name, long_name, player_positions,
    overall, potential, value_eur, wage_eur, age,
    height_cm, weight_kg, club_name, league_name, nationality_name,
    preferred_foot, weak_foot, skill_moves, player_face_url,
    pace, shooting, passing, dribbling, defending, physic,
    player_traits, player_tags
) VALUES %s
ON CONFLICT (player_id) DO UPDATE SET
    player_url = EXCLUDED.player_url,
    short_name = EXCLUDED.short_name,
    long_name = EXCLUDED.long_name,
    player_positions = EXCLUDED.player_positions,
    overall = EXCLUDED.overall,
    potential = EXCLUDED.potential,
    value_eur = EXCLUDED.value_eur,
    wage_eur = EXCLUDED.wage_eur,
    age = EXCLUDED.age,
    height_cm = EXCLUDED.height_cm,
    weight_kg = EXCLUDED.weight_kg,
    club_name = EXCLUDED.club_name,
    league_name = EXCLUDED.league_name,
    nationality_name = EXCLUDED.nationality_name,
    preferred_foot = EXCLUDED.preferred_foot,
    weak_foot = EXCLUDED.weak_foot,
    skill_moves = EXCLUDED.skill_moves,
    player_face_url = EXCLUDED.player_face_url,
    pace = EXCLUDED.pace,
    shooting = EXCLUDED.shooting,
    passing = EXCLUDED.passing,
    dribbling = EXCLUDED.dribbling,
    defending = EXCLUDED.defending,
    physic = EXCLUDED.physic,
    player_traits = EXCLUDED.player_traits,
    player_tags = EXCLUDED.player_tags
"""


def resolve_csv_path() -> Path:
    script_dir = Path(__file__).resolve().parent
    candidates = [
        script_dir.parent.parent / "FC26_20250921.csv",
        script_dir.parent / "FC26_20250921.csv",
        Path(r"c:\Users\shmaj\AppData\Local\Temp\IDO NEW\FC26_20250921.csv"),
    ]
    for path in candidates:
        if path.exists():
            return path
    raise FileNotFoundError(
        "FC26_20250921.csv not found. Expected at project root (IDO NEW/)."
    )


def to_int(value):
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None
    if isinstance(value, str):
        stripped = value.strip()
        if stripped == "":
            return None
        try:
            return int(float(stripped))
        except ValueError:
            return None
    try:
        if pd.isna(value):
            return None
    except TypeError:
        pass
    try:
        return int(value)
    except (ValueError, TypeError):
        return None


def to_float(value):
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None
    if isinstance(value, str):
        stripped = value.strip()
        if stripped == "":
            return None
        try:
            return float(stripped)
        except ValueError:
            return None
    try:
        if pd.isna(value):
            return None
    except TypeError:
        pass
    try:
        return float(value)
    except (ValueError, TypeError):
        return None


def to_text(value):
    if value is None:
        return None
    try:
        if pd.isna(value):
            return None
    except TypeError:
        pass
    text = str(value).strip()
    return text if text else None


def sanitize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    df = df[CSV_COLUMNS].copy()

    for col in INT_COLUMNS:
        df[col] = df[col].map(to_int)

    for col in FLOAT_COLUMNS:
        df[col] = df[col].map(to_float)

    for col in TEXT_COLUMNS:
        df[col] = df[col].map(to_text)

    # Required NOT NULL fields
    df = df[df["player_id"].notna()]
    df["short_name"] = df["short_name"].fillna(df["long_name"]).fillna("Unknown")
    df["overall"] = df["overall"].fillna(0).astype(int)
    df["potential"] = df["potential"].fillna(0).astype(int)

    # Pandas promotes nullable int columns to float when NaN is present; use None for SQL NULL
    df = df.where(pd.notnull(df), None)

    return df


def _cell_value(value):
    if value is None:
        return None
    try:
        if pd.isna(value):
            return None
    except TypeError:
        pass
    if isinstance(value, float) and value != value:  # NaN
        return None
    return value


def rows_from_dataframe(df: pd.DataFrame) -> list[tuple]:
    records = []
    for row in df.itertuples(index=False):
        records.append(tuple(_cell_value(getattr(row, col)) for col in CSV_COLUMNS))
    return records


def upload_batches(conn, rows: list[tuple]) -> int:
    total = 0
    with conn.cursor() as cur:
        for start in range(0, len(rows), BATCH_SIZE):
            batch = rows[start : start + BATCH_SIZE]
            execute_values(cur, INSERT_SQL, batch, page_size=len(batch))
            total += len(batch)
            print(f"  Inserted {total:,} / {len(rows):,} rows...")
    conn.commit()
    return total


def main() -> int:
    csv_path = resolve_csv_path()
    print(f"Reading CSV: {csv_path}")

    df = pd.read_csv(csv_path, dtype=str, keep_default_na=False, na_values=[""])
    print(f"  Parsed {len(df):,} rows from CSV")

    df = sanitize_dataframe(df)
    print(f"  {len(df):,} rows ready after sanitization")

    rows = rows_from_dataframe(df)
    if not rows:
        print("No rows to upload.")
        return 1

    print(f"Connecting to Neon (batch size: {BATCH_SIZE})...")
    conn = psycopg2.connect(DATABASE_URL)

    try:
        uploaded = upload_batches(conn, rows)
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM players")
            db_count = cur.fetchone()[0]
        print(f"\nMigration complete.")
        print(f"  Rows uploaded this run: {uploaded:,}")
        print(f"  Total rows in players table: {db_count:,}")
        return 0 if db_count >= uploaded else 1
    finally:
        conn.close()


if __name__ == "__main__":
    sys.exit(main())
