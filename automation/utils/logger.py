import os
import logging
from automation.config.config import Config

os.makedirs(Config.LOGS_DIR, exist_ok=True)
log_file_path = os.path.join(Config.LOGS_DIR, "automation.log")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    handlers=[
        logging.FileHandler(log_file_path, mode="a"),
        logging.StreamHandler()
    ]
)

def get_logger(name: str):
    return logging.getLogger(name)
