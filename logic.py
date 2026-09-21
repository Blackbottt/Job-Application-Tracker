from database import create_connection

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
            param_validation_function()
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

def param_validation_function(params):
    if params is not None {
        try:
            company = params.get('company_name')
            position = params.get('position')
            status = params.get('status')
            date_applied = params.get('date_applied')
            job_posting_url = params.get('job_posting_url')
            notes = params.get('notes')
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

            if params.values() == "":
            return {"error": "Invalid"}, 400
            
            return valid_input, {}

        except Exception as e:
            return "{e} is unacceptable input, please enter valid inputs"
    } else {
        return {"Error": "Bad Inputs Used!"}, 400
    }