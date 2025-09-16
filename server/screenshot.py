from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

SCREENSHOT_PATH = "screenshot.png"

def capture_screenshot(url, save_path=SCREENSHOT_PATH):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1280,800")

    driver = webdriver.Chrome(options=chrome_options)
    driver.get(url)
    time.sleep(5)  # wait for page load

    driver.save_screenshot(save_path)
    driver.quit()
    return save_path
