from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class TranslatePage(BasePage):
    START_BTN = (By.XPATH, "//button[contains(text(), 'Start Translation')]")
    STOP_BTN = (By.XPATH, "//button[contains(text(), 'Stop Translation')]")
    TTS_BTN = (By.XPATH, "//button[contains(text(), 'Text-to-Speech')]")

    def open(self):
        self.navigate_to("/translate")
