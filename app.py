from flask import Flask, request, render_template, jsonify
import logic
import init_db
init_db.init_db()

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/applications')
def get_job_applications_route():
    # Calls function that retrieves all applications in db
    applications = logic.get_job_applications()
    return jsonify(applications)

@app.route('/applications', methods=["POST"])
def add_job_applications_route():
    # retrieves data, validates status and calls a function that adds applications
    data = request.json

    if not data:
        return {"error": "Title is required"}, 400

    valid_data = logic.param_validation_function(data)
    if isinstance(valid_data, tuple):
        return valid_data

    logic.add_job_application(valid_data)
    
    return {"message": "Job application added successfully."}, 201

@app.route('/applications/<int:id>', methods=["PATCH"])
def edit_job_application_route(id):
    # retrieves data and data is param to a function that will edit an application
    data = request.json

    if not data:
        return {"error": "Title is required"}, 400
    
    valid_id = logic.id_validation(id)

    if isinstance(valid_id, tuple):
        return valid_id

    valid_data = logic.param_validation_function(data)

    if isinstance(valid_data, tuple):
            return valid_data

    updated = logic.edit_job_application(valid_id, valid_data)

    if updated == 0:
        return {"error": "Application not found"}, 404
    return {"message": "Job application updated successfully."}, 200

@app.route('/applications/<int:application_id>', methods=["DELETE"])
def delete_job_application_route(application_id):
    # calls a deleting function with handling for non-existent application
    # deleted = logic.delete_job_application(application_id)
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
    # deleted = logic.delete_job_applications()
    deleted = logic.application_deletion()

    if deleted == 0:
        return {"error": "Applications not found"}, 404
    return {"message": "Job application deleted successfully."}, 200

@app.errorhandler(404)
def not_found(error):
    return {"error": "Resource not found"}, 404

@app.errorhandler(500)
def internal_error(error):
    return {"error": "Internal server error"}, 500

if __name__ == '__main__':
    app.run(debug=True)