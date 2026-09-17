from database import create_connection

def init_db():
    conn = create_connection("job_applications.db")
    # if conn is not None:
    with open("schema.sql", "r") as f:
        sql_script = f.read()
    try:
        conn.executescript(sql_script)
        print("Database initialized successfully.")
    except Exception as e:
        print(f"An error occurred while initializing the database: {e}")
    finally:
        conn.close()
    # else:
        # print("Error! Cannot create the database connection.")