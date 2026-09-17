from database import create_connection

def add_job_application(company, position, status, date_applied):
    conn = create_connection("job_applications.db")
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO job_applications (company, position, status, date_applied)
                VALUES (?, ?, ?, ?)
            """, (company, position, status, date_applied))
            conn.commit()
            print("Job application added successfully.")
        except Exception as e:
            print(f"An error occurred while adding the job application: {e}")
        finally:
            conn.close()
    else:
        print("Error! Cannot create the database connection.")

