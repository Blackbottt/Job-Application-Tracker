from database import create_connection

def add_job_application(company, position, status, date_applied):
    db_command = """INSERT INTO job_applications (company, position, status, date_applied)
    VALUES (?, ?, ?, ?)""", (company, position, status, date_applied)
    job_application_command(db_command)
            

def job_application_command(command):
    conn = create_connection("job_applications.db")
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute(command)
            results = cursor.fetchall()
            return results
        except Exception as e:
            print(f"An error occurred while executing the command: {e}")
            return None
        finally:
            conn.close()

