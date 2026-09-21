from flask import Flask, request, render_template, jsonify
import logic
import init_db
init_db.init_db()

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/applications')
def get_job_applications():
    # Calls function that retrieves all applications in db
    applications = logic.get_job_applications()
    return jsonify(applications)

@app.route('/applications', methods=["POST"])
def add_job_applications():
    # retrieves data, validates status and calls a function that adds applications
    data = request.json

    if not data:
        return {"error": "Title is required"}, 400

    company = data.get('company_name')
    position = data.get('position')
    status = data.get('status')
    date_applied = data.get('date_applied')
    job_posting_url = data.get('job_posting_url')
    notes = data.get('notes')

    ALLOWED_STATUSES = {
        "Applied",
        "Interview",
        "Accepted",
        "Rejected",
        "Wishlist",
        "Offer",
        "Rejected",
        "Withdrawn"
    }

    if status not in ALLOWED_STATUSES:
        return {"error": "Invalid status"}, 400

    logic.add_job_application(company, position, status, date_applied, notes, job_posting_url)
    return {"message": "Job application added successfully."}, 201

@app.route('/applications/<int:id>', methods=["PATCH"])
def edit_job_application(id):
    # retrieves data and data is param to a function that will edit an application
    data = request.json

    if not data:
        return {"error": "Title is required"}, 400

    updated = logic.edit_job_application(id, data)

    if updated == 0:
        return {"error": "Application not found"}, 404
    return {"message": "Job application updated successfully."}, 200

@app.route('/applications/<int:application_id>', methods=["DELETE"])
def delete_job_application(application_id):
    # calls a deleting function with handling for non-existent application
    deleted = logic.delete_job_application(application_id)

    if deleted == 0:
        return {"error": "Application not found"}, 400
    return {"message": "Job application deleted successfully."}, 200

@app.route('/applications/delete', methods=["DELETE"])
def delete_job_applications():
    # calls a deleting function for all applications with handling for non-existent application
    deleted = logic.delete_job_applications()

    if deleted == 0:
        return {"error": "Applications not found"}, 400
    return {"message": "Job application deleted successfully."}, 200

if __name__ == '__main__':
    app.run(debug=True)