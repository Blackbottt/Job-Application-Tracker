from database import create_connection

def add_job_application():
    conn = create_connection("job_applications.db")

    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO applications (company, position, status, applied_date, job_url, notes)"
VALUES (?, ?, ?, ?, ?, ?))
            conn.commit()

        except Sqlite3.Error as e:
            print(f"Datanase error: {e}")

        conn.close()