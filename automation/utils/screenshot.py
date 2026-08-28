import os
import time
from automation.config.config import Config
from automation.utils.logger import get_logger

logger = get_logger("ScreenshotUtility")

os.makedirs(Config.SCREENSHOTS_DIR, exist_ok=True)

def capture_screenshot(driver, test_id: str) -> str:
    try:
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = f"{test_id}_{timestamp}.png"
        filepath = os.path.join(Config.SCREENSHOTS_DIR, filename)
        if driver:
            driver.save_screenshot(filepath)
            logger.info(f"Captured screenshot for {test_id} at {filepath}")
            return filepath
    except Exception as e:
        logger.error(f"Failed to capture screenshot for {test_id}: {e}")
    return ""
