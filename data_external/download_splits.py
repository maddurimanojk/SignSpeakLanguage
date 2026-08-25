"""
Downloads Train_Test_Split.zip from Zenodo Record 4010759 for INCLUDE / INCLUDE-50.
"""

import urllib.request
import zipfile
from pathlib import Path

DATA_EXTERNAL_DIR = Path(__file__).parent
RAW_DIR = DATA_EXTERNAL_DIR / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

url = "https://zenodo.org/records/4010759/files/Train_Test_Split.zip"
zip_path = RAW_DIR / "Train_Test_Split.zip"

print(f"Downloading {url}...")
try:
    urllib.request.urlretrieve(url, zip_path)
    print(f"Downloaded Train_Test_Split.zip ({zip_path.stat().st_size} bytes)")
    with zipfile.ZipFile(zip_path, 'r') as zf:
        zf.extractall(RAW_DIR)
    print("Extracted Train_Test_Split.zip successfully.")
except Exception as e:
    print(f"Error downloading Train_Test_Split.zip: {e}")
