from database import create_connection
from urllib.parse import urlparse
import re

def get_job_applications():
    """function that takes the db and retrieves all applications
    :returns: an object with every row
    """
    conn = create_connection("job_applications.db")

    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("""SELECT * FROM job_applications""")
            applications = cursor.fetchall()
            return [dict(row) for row in applications]
        except Exception as e:
            print(f"An error occurred while retrieving the job application: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")

def add_job_application(job_application_date, company_name, position, status, platform_applied, job_starting_date, notes, job_posting_url):
    """function that takes the db and adds data to it
    :params: job_application_date, company_name, position, status, platform_applied, job_starting_date, notes, job_posting_url
    :returns: a count of all existing rows in the db
    """
    conn = create_connection("job_applications.db")

    if conn is not None:
        try:
            print("ADDING CODED -->>")
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO job_applications (
                job_application_date, 
                company_name, 
                position, 
                status, 
                application_platform, 
                job_starting_date, 
                notes, 
                job_posting_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                job_application_date,
                company_name,
                position, 
                status, 
                platform_applied, 
                job_starting_date, 
                notes, 
                job_posting_url
                ))
            conn.commit()
            return cursor.rowcount
        except Exception as e:
            print(f"An error occurred while adding the job application: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")

def edit_job_application(edit_id, data):
    """Updates an existing job application.
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
                "job_application_date",
                "company_name",
                "position",
                "status",
                "platform_applied",
                "job_starting_date",
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
            return cursor.rowcount
        except Exception as e:
            print(f"An error occurred while editing the job application: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")

def application_deletion(application_id=None):
    """Deletes one application or all applications.
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
            finally:
                conn.close()
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
            finally:
                conn.close()
    
    else:
        print("Error! Cannot delete the database connection.")

def param_validation_function(params, edit=False):
    """This function validates dict values, calling valid type checking functions
        :params: dict and edit option
        :returns: tuple with error/success code
    """
    if not isinstance(params, dict):
        return {"error": "Input must be a dictionary"}, 400

# POST: required fields
    if not edit:
        required_fields = [
            "job_application_date",
            "company_name",
            "position",
            "platform_applied",
            "job_starting_date",
            "status"
        ]

        for field in required_fields:
            if field not in params:
                return {"error": f"{field} is required"}, 400

    valid_data = {}
    error_obj = {
        "error": "Invalid input",
        "fields": {}
    }

    if "job_application_date" in params:
        job_application_date = string_validation(params["job_application_date"])
        valid_data["job_application_date"] = job_application_date[0]
        if job_application_date[-1] == False:
            error_obj["fields"]["job_application_date"] = job_application_date[0]
    else:
        job_application_date = None
    
    if "company_name" in params:
        company = string_validation(params["company_name"])
        valid_data["company_name"] = company[0]
        if company[-1] == False:
            error_obj["fields"]["company name"] = company[0]
    else:
        company = None

    if "position" in params:
        position = string_validation(params["position"])
        valid_data["position"] = position[0]
        if position[-1] == False:
            error_obj["fields"]["position"] = position[0]
    else:
        position = None

    if "platform_applied" in params:
        platform_applied = string_validation(params["platform_applied"])
        valid_data["platform_applied"] = platform_applied[0]
        if platform_applied[-1] == False:
            error_obj["fields"]["platform_applied"] = platform_applied[0]
    else:
        platform_applied = None

    if "job_starting_date" in params:
        job_starting_date = string_validation(params["job_starting_date"])
        valid_data["job_starting_date"] = job_starting_date[0]
        if job_starting_date[-1] == False:
            error_obj["fields"]["job_starting_date"] = job_starting_date[0]
    else:
        job_starting_date = None

    if "status" in params:
        status = status_validation(params["status"])
        valid_data["status"] = status[0]
        if status[-1] == False:
            error_obj["fields"]["status"] = status[0]
    else:
        status = None

    if "job_posting_url" in params:
        job_posting_url = url_validation(params["job_posting_url"])
        valid_data["job_posting_url"] = job_posting_url[0]
        if job_posting_url[-1] == False:
            error_obj["fields"]["job_posting_url"] = job_posting_url[0]
    else:
        job_posting_url = None

    if "notes" in params:
        notes = string_validation(params["notes"])
        valid_data["notes"] = notes[0]
        if notes[-1] == False:
            if edit:
                error_obj["fields"]["notes"] = notes[0]
            else:
                valid_data["notes"] = ""
    else:
        notes = None

    if len(error_obj["fields"]) > 0:
        return error_obj, 400

    return valid_data, 200

def id_validation(id):
    """Checks id value size"""
    if id <= 0:
        return {"error": "ID must be greater than 0"}, 400
    
    return id

def string_validation(value):
    """Checks for str Type"""
    if value is None or not isinstance(value, str):
        return "Input is not a String", False

    valid_str = value.strip()
        
    if not valid_str:
        return "Input is not a String", False

    return valid_str, True

def status_validation(params):
    """Checks if given parameter is within Set of allowed statuses"""
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
        return "Invalid status", False

    return params, True

def url_validation(url: str, default_scheme: str = "http"):
    """Url checking function for scheme, adds scheme if none and validates Url
    :params: url, scheme
    :returns: str
    """
    if not isinstance(url, str) or not url.strip():
        return "URL must be a string", False

    parsed_url = urlparse(url)
    # If scheme is missing, prepend the default
    if not parsed_url.scheme:
        url = f"{default_scheme}://{url}"
        parsed = urlparse(url)

    # Basic URL validation regex (RFC 3986 simplified)
    url_regex = re.compile(
        r'^(?:http|https|ftp)://'  # Allowed schemes
        r'(?:\S+(?::\S*)?@)?'      # Optional user:pass@
        r'(?:[A-Za-z0-9.-]+|\[[A-Fa-f0-9:]+\])'  # Host or IPv6
        r'(?::\d{2,5})?'           # Optional port
        r'(?:[/?#][^\s]*)?$',      # Path/query/fragment
        re.IGNORECASE
    )

    if not url_regex.match(url):
        return f"Invalid URL format: {url}", False

    return url, True
