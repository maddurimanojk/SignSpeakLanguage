from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class HomePage(BasePage):
    HERO_TITLE = (By.TAG_NAME, "h1")
    START_TRANSLATING_BTN = (By.XPATH, "//a[contains(text(), 'Start Translating')]")
    LEARN_MORE_BTN = (By.XPATH, "//a[contains(text(), 'Learn More')]")
    NAV_HOME = (By.XPATH, "//a[contains(text(), 'Home')]")
    NAV_TRANSLATE = (By.XPATH, "//a[contains(text(), 'Translate')]")
    NAV_LEARN = (By.XPATH, "//a[contains(text(), 'Learn')]")
    NAV_HISTORY = (By.XPATH, "//a[contains(text(), 'History')]")
    NAV_RESEARCH = (By.XPATH, "//a[contains(text(), 'Research')]")
    NAV_ABOUT = (By.XPATH, "//a[contains(text(), 'About')]")

    def open(self):
        self.navigate_to("/")

    def get_hero_text(self) -> str:
        return self.find_element(*self.HERO_TITLE).text
