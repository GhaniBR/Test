import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json

def generate_suitable_xpaths(driver):
    elements = []
    tag_filter = ['input', 'button', 'a', 'textarea', 'select']

    for tag in tag_filter:
        elems = driver.find_elements(By.TAG_NAME, tag)
        for index, elem in enumerate(elems):
            try:
                xpath = ''
                id_attr = elem.get_attribute('id')
                name_attr = elem.get_attribute('name')
                aria_attr = elem.get_attribute('aria-label')
                class_attr = elem.get_attribute('class')
                text_content = elem.text.strip()

                if id_attr:
                    xpath = f"//{tag}[@id='{id_attr}']"
                elif name_attr:
                    xpath = f"//{tag}[@name='{name_attr}']"
                elif aria_attr:
                    xpath = f"//{tag}[@aria-label='{aria_attr}']"
                elif class_attr:
                    class_value = class_attr.split(' ')[0]
                    xpath = f"//{tag}[contains(@class, '{class_value}')]"
                elif text_content:
                    text_snippet = text_content[:20].replace('"', '\\"')
                    xpath = f"//{tag}[contains(text(), \"{text_snippet}\")]"
                else:
                    xpath = f"(//{tag})[{index + 1}]"

                elements.append(xpath)

            except Exception as e:
                print(f"[WARN] Error during XPath generation: {e}")
    
    return list(set(elements))

def classify_element(element):
    tag = element.tag_name.lower()
    if tag in ['input', 'textarea']:
        input_type = element.get_attribute('type')
        if input_type in ['text', 'email', 'password', None]:
            return 'form_input'
    elif tag in ['button', 'a', 'select']:
        return 'clickable'
    return 'unknown'

def main():
    if len(sys.argv) < 2:
        print("Usage: python test.py <url>")
        return

    url = sys.argv[1]   # <-- Now frontend URL will be used
    driver = webdriver.Chrome()
    driver.get(url)
    time.sleep(5)
    ...


    print("[INFO] Generating robust XPaths...")
    generated_xpaths = generate_suitable_xpaths(driver)
    with open('robust_generated_xpaths.txt', 'w') as xpath_file:
        for xpath in generated_xpaths:
            xpath_file.write(xpath + '\n')

    print(f"[INFO] {len(generated_xpaths)} XPaths generated and saved.")

    print("[INFO] Starting automated test execution...")
    results = []
    for index, xpath in enumerate(generated_xpaths):
        test_case = {
            'index': index + 1,
            'xpath': xpath,
            'predicted_action': None,
            'status': 'Not Executed',
            'error': None,
            'element_outerHTML': None
        }

        try:
            element = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, xpath))
            )

            # Skip if element is not visible or disabled
            if not element.is_displayed() or not element.is_enabled():
                test_case['status'] = 'Skipped (Invisible or Disabled)'
                test_case['element_outerHTML'] = element.get_attribute('outerHTML')
                results.append(test_case)
                continue

            prediction = classify_element(element)
            test_case['predicted_action'] = prediction
            test_case['element_outerHTML'] = element.get_attribute('outerHTML')

            if prediction == 'form_input':
                element.clear()
                element.send_keys('test_input')
                test_case['status'] = 'Success (Form Input Filled)'

            elif prediction == 'clickable':
                element.click()
                test_case['status'] = 'Success (Clicked Element)'

            else:
                test_case['status'] = 'Skipped (Unknown Element Type)'

        except Exception as e:
            test_case['status'] = 'Failure'
            test_case['error'] = str(e)

        results.append(test_case)

    with open('final_ai_test_results.json', 'w') as report_file:
        json.dump(results, report_file, indent=4)

    print("[INFO] AI-powered test execution complete. Results saved in 'final_ai_test_results.json'")
    driver.quit()

if __name__ == '__main__':
    main()
