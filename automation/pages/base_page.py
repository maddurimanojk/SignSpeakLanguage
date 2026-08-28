from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from automation.config.config import Config
from automation.utils.logger import get_logger

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.logger = get_logger(self.__class__.__name__)
        self.wait = WebDriverWait(self.driver, Config.EXPLICIT_WAIT)

    def navigate_to(self, path: str = ""):
        target_url = f"{Config.BASE_URL.rstrip('/')}/{path.lstrip('/')}"
        self.logger.info(f"Navigating to {target_url}")
        self.driver.get(target_url)

    def find_element(self, by: By, locator: str):
        return self.wait.until(EC.presence_of_element_located((by, locator)))

    def click(self, by: By, locator: str):
        element = self.wait.until(EC.element_to_be_clickable((by, locator)))
        element.click()

    def send_keys(self, by: By, locator: str, text: str):
        element = self.find_element(by, locator)
        element.clear()
        element.send_keys(text)

    def get_title(self) -> str:
        return self.driver.title

    def get_current_url(self) -> str:
        return self.driver.current_url
