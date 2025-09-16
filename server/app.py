from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import subprocess
import threading
import os

app = Flask(__name__)
CORS(app)  # ✅ Allow cross-origin requests (from React frontend)

from screenshot import capture_screenshot

def run_selenium_test(url):
    """
    Run the Selenium test script (test.py) in a separate process.
    """
    try:
        subprocess.run(['python', 'test.py', url], check=True)
    except Exception as e:
        print(f"[ERROR] Selenium test failed: {e}")

@app.route('/generate-tests', methods=['POST'])
def generate_tests():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400

    print(f"[INFO] Received URL: {url}")
    print("[INFO] Launching Selenium test in background...")

    thread = threading.Thread(target=run_selenium_test, args=(url,))
    thread.start()

    # Respond immediately
    return jsonify({'message': 'Test generation started, results will be ready soon'}), 200

@app.route('/final_ai_test_results.json', methods=['GET'])
def serve_results():
    try:
        if os.path.exists('final_ai_test_results.json'):
            return send_file('final_ai_test_results.json', mimetype='application/json')
        else:
            return jsonify([])  # empty list if results not ready yet
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/capture-screenshot', methods=['POST'])
def capture():
    data = request.get_json()
    url = data.get("url")
    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        path = capture_screenshot(url)
        return send_file(path, mimetype="image/png")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
