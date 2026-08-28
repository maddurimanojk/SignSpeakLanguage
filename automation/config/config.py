import os

class Config:
    # Target Application URL (LIVE Deployed Website)
    BASE_URL = os.getenv("BASE_URL", "https://signspeak-ai.vercel.app")
    
    # Headless Browser Settings
    HEADLESS = os.getenv("HEADLESS", "true").lower() == "true"
    BROWSER_WIDTH = int(os.getenv("BROWSER_WIDTH", "1920"))
    BROWSER_HEIGHT = int(os.getenv("BROWSER_HEIGHT", "1080"))
    EXPLICIT_WAIT = int(os.getenv("EXPLICIT_WAIT", "10"))
    
    # Directories
    ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    REPORTS_DIR = os.path.join(ROOT_DIR, "reports")
    SCREENSHOTS_DIR = os.path.join(ROOT_DIR, "screenshots")
    LOGS_DIR = os.path.join(ROOT_DIR, "logs")
    
    # Appium Mobile Config
    APPIUM_SERVER_URL = os.getenv("APPIUM_SERVER_URL", "http://localhost:4723/wd/hub")
    PLATFORM_NAME = "Android"
    DEVICE_NAME = os.getenv("DEVICE_NAME", "Android Emulator")
    APP_PACKAGE = "com.signspeak.ai"
    APP_ACTIVITY = ".MainActivity"
