"""
Direct LFS downloader for Indian Sign Language Dataset (ayeshatasnim-h / ISL).
Downloads dataset_ISL.zip (120 MB) directly from GitHub LFS media server.
"""

import os
import urllib.request
import zipfile
from pathlib import Path

DATA_EXTERNAL_DIR = Path(__file__).parent
RAW_DIR = DATA_EXTERNAL_DIR / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

url = "https://media.githubusercontent.com/media/ayeshatasnim-h/Indian-Sign-Language-dataset/main/dataset_ISL.zip"
dest_zip = RAW_DIR / "dataset_ISL.zip"

print(f"Downloading ISL dataset from {url}...")
try:
    urllib.request.urlretrieve(url, dest_zip)
    print(f"Downloaded dataset_ISL.zip ({dest_zip.stat().st_size / (1024*1024):.2f} MB)")
    
    print("Extracting dataset_ISL.zip...")
    with zipfile.ZipFile(dest_zip, 'r') as zf:
        zf.extractall(RAW_DIR)
    print("Extracted ISL dataset successfully.")
except Exception as e:
    print(f"Error downloading/extracting dataset_ISL.zip: {e}")
