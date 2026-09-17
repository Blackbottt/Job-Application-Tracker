import sqlite3

def create_connection(db_file):
    """ create a database connection to the SQLite database specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        conn.row_factory = sqlite3.Row  #erlaubt spater den Zugriff auf die Spaltennamen
        return conn
    except sqlite3.Error as e:
        print(e)

    return conn

