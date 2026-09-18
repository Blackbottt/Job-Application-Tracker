from database import create_connection
# import os

def add_job_application(company_name, position, status, date_applied, notes, job_posting_url):
    conn = create_connection("job_applications.db")
    if conn is not None:
        try:
            # print("OS add: ", os.path.abspath("job_applications.db"))
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO job_applications (company_name, position, status, application_date, notes, job_posting_url)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (company_name, position, status, date_applied, notes, job_posting_url))
            conn.commit()
            print("Job application added successfully.")
            return cursor.rowcount()
        except Exception as e:
            print(f"An error occurred while adding the job application: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")

def get_job_applications():
    conn = create_connection("job_applications.db")
    if conn is not None:
        try:
            # print("OS add2: ", os.path.abspath("job_applications.db"))
            cursor = conn.cursor()
            cursor.execute("""SELECT * FROM job_applications""")
            print("Jobs sucessfully retrieved")
            applications = cursor.fetchall()
            return [dict(row) for row in applications]
        except Exception as e:
            print(f"An error occurred while adding the job application: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")

def edit_job_application(id):
    conn = create_connection("job_applications.db")

    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("""SELECT * FROM job_applications WHERE id = ?""")
            row = cursor.fetchall()

            if row is None:
                return print("Error! Cannot create the database connection.")
            
            cursor.execute(
                """
                UPDATE job_applications
                SET company_name = ?,
                position = ?,
                status = ?,
                application_date = ?,
                notes = ?,
                job_posting_url = ?
                WHERE id = ?
                """, (company_name, position, status, date_applied, notes, job_posting_url, id)
            )
            conn.commit()
            print(f"Record with ID {id} updated successfully.")
            return cursor.rowcount()

        except Exception as e:
            print(f"An error occurred while adding the job application: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")

def delete_job_application(id):
    conn = create_connection("job_applications.db")
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("""DELETE FROM job_applications WHERE id = ?""", (id,))
            conn.commit()
            return cursor.rowcount()
        except Exception as e:
            print(f"An error occurred while adding the job application: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")

def delete_job_applications():
    conn = create_connection("job_applications.db")
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("""DELETE FROM job_applications""")
            conn.commit()
            return cursor.rowcount()
        except Exception as e:
            print(f"An error occurred while adding the job application: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")

