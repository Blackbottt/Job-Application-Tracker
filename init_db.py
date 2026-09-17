from database import create_connection

def init_db():
    conn = create_connection("job_applications.db")
    if conn is not None:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company TEXT NOT NULL,
                position TEXT NOT NULL,
                status TEXT NOT NULL,
                date_applied TEXT NOT NULL
            )
        ''')
        conn.commit()
        conn.close()
    else:
        print("Error! cannot create the database connection.")