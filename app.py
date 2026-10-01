from flask import Flask, request, render_template, jsonify
import logic
import init_db
init_db.init_db()

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/dashboard')
def dashboard ():
    return render_template("dashboard.html")

@app.route('/applications')
def get_job_applications_route():
    # Calls function that retrieves all applications in db
    applications = logic.get_job_applications()
    return jsonify(applications)

@app.route('/applications', methods=["GET"])
def search_applications_route():
    data = request.json
    if not data:
        return {"error": "Request Body is required"}, 400   
    search_results = logic.search_job_applications()
    return jsonify(search_results)

@app.route('/applications', methods=["POST"])
def add_job_applications_route():
    # Retrieves and validates request data, then adds the application.
    data = request.json
    print("dateDATA", data)

    if not data:
        return {"error": "Request Body is required"}, 400

    data, status_code = logic.param_validation_function(data, edit=False)
    print("dateDATA2", data)

    if status_code != 200:
        return data, status_code

    print("dateA", data["job_application_date"])
    print("dateB", data["job_starting_date"])

    logic.add_job_application(
        data["job_application_date"],
        data["company_name"],
        data["position"],
        data["status"],
        data["platform_applied"],
        data["job_starting_date"],
        data["notes"],
        data["job_posting_url"],
    )
    
    return {"message": "Job application added successfully."}, 201

@app.route('/applications/<int:id>', methods=["PATCH"])
def edit_job_application_route(id):
    # retrieves data and data is param to a function that will edit an application
    data = request.json

    if not data:
        return {"error": "Request Body is required"}, 400
    
    valid_id = logic.id_validation(id)

    if isinstance(valid_id, tuple):
        return valid_id

    data, status_code = logic.param_validation_function(data, edit=True)

    if status_code != 200:
        return data, status_code

    updated = logic.edit_job_application(valid_id, data)

    if updated == 0:
        return {"error": "Application not found"}, 404
    return {"message": "Job application updated successfully."}, 200

@app.route('/applications/<int:application_id>', methods=["DELETE"])
def delete_job_application_route(application_id):
    # calls a deleting function with handling for non-existent application    
    valid_id = logic.id_validation(application_id)

    if isinstance(valid_id, tuple):
        return valid_id

    deleted = logic.application_deletion(valid_id)

    if deleted == 0:
        return {"error": "Application not found"}, 404
    return {"message": "Job application deleted successfully."}, 200

@app.route('/applications/delete', methods=["DELETE"])
def delete_job_applications_route():
    # calls a deleting function for all applications with handling for non-existent application
    deleted = logic.application_deletion()

    if deleted == 0:
        return {"error": "Applications not found"}, 404
    return {"message": "Job applications deleted successfully."}, 200

@app.errorhandler(404)
def not_found(error):
    return {"error": "Resource not found"}, 404

@app.errorhandler(500)
def internal_error(error):
    return {"error": "Internal server error"}, 500

if __name__ == '__main__':
    app.run(debug=True)