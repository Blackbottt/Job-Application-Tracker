from flask import Flask, request, render_template, jsonify
import logic

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/applications')
def get_job_applications():
    applications = logic.get_job_applications()
    print("A: ", applications)
    return jsonify(applications)

@app.route('/applications', methods=["POST"])
def add_job_applications():
    data = request.json
    company = data.get('company')
    position = data.get('position')
    status = data.get('status')
    date_applied = data.get('date_applied')
    job_posting_url = data.get('job_Url')
    notes = data.get('notes')

    if not data:
        return {"error": "Title is required"}, 400
    logic.add_job_application(company, position, status, date_applied, notes, job_posting_url)
    return {"message": "Job application added successfully."}, 201

if __name__ == '__main__':
    app.run(debug=True)