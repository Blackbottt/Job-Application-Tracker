from flask import Flask, render_template, jsonify
import logic

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/applications')
def get_job_applications():
    applications = logic.get_job_applications()
    return jsonify(applications)

if __name__ == '__main__':
    app.run(debug=True)