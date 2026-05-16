import pandas as pd
from pathlib import Path
from upload import CSV_COLUMNS, sanitize_dataframe, resolve_csv_path

csv_path = resolve_csv_path()
df = pd.read_csv(csv_path, dtype=str, keep_default_na=False, na_values=[""])
raw = df[df["player_id"] == "210257"].iloc[0]
print("RAW row for 210257:")
for col in CSV_COLUMNS:
    print(f"  {col}: {repr(raw.get(col, 'MISSING'))}")

df2 = sanitize_dataframe(df)
clean = df2[df2["player_id"] == 210257].iloc[0]
print("\nSANITIZED:")
for col in CSV_COLUMNS:
    val = clean[col]
    print(f"  {col}: {repr(val)} ({type(val).__name__})")
