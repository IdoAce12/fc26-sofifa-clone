"""Find rows with values that overflow PostgreSQL integer columns."""
import sys

import pandas as pd

sys.path.insert(0, str(__file__).rsplit("\\", 1)[0] if "\\" in __file__ else ".")

from upload import INT_COLUMNS, FLOAT_COLUMNS, sanitize_dataframe, resolve_csv_path

INT_MAX = 2_147_483_647
INT_MIN = -2_147_483_648

csv_path = resolve_csv_path()
df = pd.read_csv(csv_path, dtype=str, keep_default_na=False, na_values=[""])
df = sanitize_dataframe(df)

print("Max values per integer column:")
for col in INT_COLUMNS:
    s = df[col].dropna()
    if len(s):
        print(f"  {col}: max={s.max()}, min={s.min()}")

for col in INT_COLUMNS:
    bad = df[df[col].notna() & ((df[col] > INT_MAX) | (df[col] < INT_MIN))]
    if len(bad):
        print(f"OVERFLOW in {col}: {len(bad)} rows, first player_id={bad.iloc[0]['player_id']}")

print(f"\nTotal rows: {len(df)}")
