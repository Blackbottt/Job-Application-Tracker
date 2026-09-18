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
    if not data:
        return {"error": "Title is required"}, 400
    company = data.get('company_name')
    position = data.get('position')
    status = data.get('status')
    date_applied = data.get('date_applied')
    job_posting_url = data.get('job_posting_url')
    notes = data.get('notes')
    
    logic.add_job_application(company, position, status, date_applied, notes, job_posting_url)
    return {"message": "Job application added successfully."}, 201

@app.route('/applications/<int:id>', methods=["PUT"])
def edit_job_application(id):
    data = request.json
    if not data:
        return {"error": "Title is required"}, 400
    company_name = data.get('company_name')
    position = data.get('position')
    status = data.get('status')
    date_applied = data.get('date_applied')
    job_posting_url = data.get('job_posting_url')
    notes = data.get('notes')
    logic.edit_job_application(company_name, position, status, date_applied, notes, job_posting_url, id)
    return {"message": "Job application added successfully."}, 201

@app.route('/applications/<int:id>', methods=["DELETE"])
def delete_job_application(id):
    data = logic.delete_job_application(id)
    if not data:
        return {"error": "Title is required"}, 400
    return {"message": "Job application added successfully."}, 201

@app.route('/applications/delete', methods=["DELETE"])
def delete_job_applications():
    data = logic.delete_job_applications()
    if not data:
        return {"error": "Title is required"}, 400
    return {"message": "Job application added successfully."}, 201

if __name__ == '__main__':
    app.run(debug=True)