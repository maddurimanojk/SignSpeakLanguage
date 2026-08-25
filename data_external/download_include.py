"""
Download script for AI4Bharat INCLUDE-50 Indian Sign Language Dataset.
Fetches official dataset zip archives directly from Zenodo Record 4010759.
"""

import os
import urllib.request
import zipfile
from pathlib import Path

DATA_EXTERNAL_DIR = Path(__file__).parent
RAW_DIR = DATA_EXTERNAL_DIR / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

# List of Zenodo archive URLs for core sign categories in INCLUDE-50
ARCHIVES = [
    ("Greetings_1of2.zip", "https://zenodo.org/records/4010759/files/Greetings_1of2.zip"),
    ("Greetings_2of2.zip", "https://zenodo.org/records/4010759/files/Greetings_2of2.zip"),
    ("Pronouns_1of2.zip", "https://zenodo.org/records/4010759/files/Pronouns_1of2.zip"),
    ("Pronouns_2of2.zip", "https://zenodo.org/records/4010759/files/Pronouns_2of2.zip"),
    ("People_1of5.zip", "https://zenodo.org/records/4010759/files/People_1of5.zip"),
    ("Places_1of4.zip", "https://zenodo.org/records/4010759/files/Places_1of4.zip"),
]

def download_and_extract():
    print("=================================================================")
    print(" Downloading INCLUDE-50 ISL Dataset Archives from Zenodo... ")
    print("=================================================================")

    for filename, url in ARCHIVES:
        dest_zip = RAW_DIR / filename
        if not dest_zip.exists():
            print(f"Downloading {filename} from {url}...")
            try:
                urllib.request.urlretrieve(url, dest_zip)
                print(f"  Successfully downloaded {filename} ({dest_zip.stat().st_size / (1024*1024):.1f} MB)")
            except Exception as e:
                print(f"  Error downloading {filename}: {e}")
                continue
        else:
            print(f"  {filename} already exists, skipping download.")

        # Extract zip
        print(f"Extracting {filename}...")
        try:
            with zipfile.ZipFile(dest_zip, 'r') as zip_ref:
                zip_ref.extractall(RAW_DIR)
            print(f"  Successfully extracted {filename}")
        except Exception as e:
            print(f"  Error extracting {filename}: {e}")

if __name__ == "__main__":
    download_and_extract()
