import os
import logging
from flask import Flask, render_template

# Set up logging for debugging
logging.basicConfig(level=logging.DEBUG)

# Create the Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET")

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')

@app.route('/cyber-attacks')
def cyber_attacks():
    return render_template('cyber_attacks.html')

@app.route('/phishing')
def phishing():
    return render_template('phishing.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
