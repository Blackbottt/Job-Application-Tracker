from database import create_connection
from urllib.parse import urlparse


def get_job_applications():
    """function that takes the db and retrieves all applications
    :returns: an object with every row
    """
    conn = create_connection("job_applications.db")

    if conn is not None:
        try:
            print("Job conn is ON!")
            cursor = conn.cursor()
            cursor.execute("""SELECT * FROM job_applications""")
            print("Jobs sucessfully retrieved")
            applications = cursor.fetchall()
            return [dict(row) for row in applications]
        except Exception as e:
            print(f"An error occurred while retrieving the job application: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")

def add_job_application(company_name, position, status, date_applied, notes, job_posting_url):
    """function that takes the db and adds data to it
    :params: company_name, position, status, date_applied, notes, job_posting_url
    :returns: a count of all existing rows in the db
    """
    conn = create_connection("job_applications.db")

    if conn is not None:
        try:
            cursor = conn.cursor()
            # param_validation_function()
            print("adding an application...99999999999**********")
            cursor.execute("""
                INSERT INTO job_applications (company_name, position, status, application_date, notes, job_posting_url)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (company_name, position, status, date_applied, notes, job_posting_url))
            conn.commit()
            print("Job application added successfully.")
            return cursor.rowcount
        except Exception as e:
            print(f"An error occurred while adding the job application: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")

def edit_job_application(edit_id, data):
    """function that takes a db and adds data to it
    :params: edit_id, data
    :returns: a count of all existing rows in the db
    """
    conn = create_connection("job_applications.db")

    if conn is not None:
        try:
            cursor = conn.cursor()
            fields = []
            values = []
            allowed_fields = [
                "company_name",
                "position",
                "status",
                "date_applied",
                "notes",
                "job_posting_url"
            ]

            for field in allowed_fields:
                if field in data:
                    fields.append(f"{field} = ?")
                    values.append(data[field])

            if not fields:
                return 0
            values.append(edit_id)
            query = f"""
                UPDATE job_applications
                SET {", ".join(fields)}
                WHERE id = ?
            """ 
            
            cursor.execute(query, values)
            conn.commit()
            print(f"Record with ID {edit_id} updated successfully.")
            return cursor.rowcount
        except Exception as e:
            print(f"An error occurred while editing the job application: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")

def application_deletion(application_id=None):
    """function that takes a db and adds data to it
    :optional params: application_id=None
    :returns: a count of all existing rows in the db
    """
    conn = create_connection("job_applications.db")

    if conn is not None:
        if application_id is not None:
            try:
                cursor = conn.cursor()
                cursor.execute("""DELETE FROM job_applications WHERE id = ?""", (application_id,))
                conn.commit()
                return cursor.rowcount
            except Exception as e:
                        print(f"An error occurred while deleting the job application: {e}")
        else:
            try:
                cursor = conn.cursor()
                cursor.execute("""DELETE FROM job_applications""")
                cursor.execute("""
                    DELETE FROM sqlite_sequence
                    WHERE name = 'job_applications'
                """)
                conn.commit()
                return cursor.rowcount
            except Exception as e:
                print(f"An error occurred while deleting the job application: {e}")
        # finally:
            conn.close()
    
    else:
        print("Error! Cannot delete the database connection.")

def param_validation_function(params, edit=False):
    if params is None:
        return {"Error":"Input is invalid"}, 400

# POST: required fields
    if not edit:
        required_fields = [
            "company_name",
            "position",
            "date_applied",
            "status"
        ]

        for field in required_fields:
            if field not in params:
                return {"error": f"{field} is required"}, 400

    valid_data = {}
    error_obj = {
        "error": "Invalid input",
        "fields": {
            "company_name": "Must be a string",
            "position": "Required",
            "status": "Invalid status"
        }
    }

    if "company_name" in params:
        company = string_validation(params["company_name"])

        if isinstance(company, tuple):
            error_obj["Field"]["company name"] = company
        valid_data["company_name"] = company
    else:
        company = None

    if "position" in params:
        position = string_validation(params["position"])

        if isinstance(position, tuple):
            error_obj["Field"]["position"] = position
        valid_data["position"] = position
    else:
        position = None

    if "date_applied" in params:
        date_applied = string_validation(params["date_applied"])

        if isinstance(date_applied, tuple):
            error_obj["Field"]["date_applied"] = date_applied + "give a valid date"
        valid_data["date_applied"] = date_applied
    else:
        date_applied = None

    if "status" in params:
        status = status_validation(params["status"])

        if isinstance(status, tuple):
            error_obj["Field"]["status"] = status
        valid_data["status"] = status
    else:
        status = None

    if "job_posting_url" in params:
        job_posting_url = url_validation(params["job_posting_url"])

        if isinstance(job_posting_url, tuple):
            error_obj["Field"]["job_posting_url"] = job_posting_url
        valid_data["job_posting_url"] = job_posting_url
    else:
        job_posting_url = None

    if "notes" in params:
        notes = string_validation(params["notes"])

        if isinstance(notes, tuple):
            error_obj["Field"]["notes"] = notes
        valid_data["notes"] = notes
    else:
        notes = None

    if len(error_obj["fields"]) > 0:
        error_obj["fields"] = {}
        return error_obj 

    return valid_data

def id_validation(id):
    # if id is None:
    #     return {"error": "ID is required"}, 400

    if id <= 0:
        return {"error": "ID must be greater than 0"}, 400

    return id

def string_validation(value):
    if value is None or not isinstance(value, str):
        return "Input is not a String"

    valid_str = value.strip()
        
    if not valid_str:
        return "Input is not a String"

    return valid_str

def status_validation(params):
    ALLOWED_STATUSES = {
        "Applied",
        "Interview",
        "Accepted",
        "Rejected",
        "Wishlist",
        "Offer",
        "Withdrawn"
    }

    if params not in ALLOWED_STATUSES:
        return "Invalid status"

    return params

def url_validation(url):
             
    if url is None or url == "":
        return None

    if not isinstance(url, str):
        return {"error": "URL must be a string"}, 400

    url = url.strip()

    parsed_url = urlparse(url)

    if parsed_url.scheme not in ("http", "https") or not parsed_url.netloc:
        return {"error": "Invalid URL"}, 400

    return url