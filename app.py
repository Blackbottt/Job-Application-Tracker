from flask import Flask, request, render_template, jsonify
import logic

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/applications')
def get_job_applications():
    applications = logic.get_job_applications()
    print(applications)
    return jsonify(applications)

@app.route('/applications', method=["POST"])
def add_job_applications():
    data = request.json()
    params = data
    print("Params", params)
    logic.add_job_application()

if __name__ == '__main__':
    app.run(debug=True)