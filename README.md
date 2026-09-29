# Job Applications Tracker

## About

Job Applications Tracker is a web application for storing and managing job application information.

## Features

Users can:

- Add a job application
- Edit an existing application by ID
- Delete an application by ID
- Delete all applications
- Validate application input
- Validate application status and job posting URLs

## Technologies

**Frontend:**
- HTML
- CSS
- JavaScript

**Backend:**
- Python
- Flask

**Database:**
- SQLite

## Installation

1. Clone or download the repository.
2. Create and activate a Python virtual environment.
3. Install the required dependencies:

```bash
pip install -r requirements.txt
```

4. Start the application:

```bash
python app.py
```

## Usage

Open the application in your browser after starting the Flask server.

The application allows users to create, view, edit, and delete job applications.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Displays the home page |
| GET | `/applications` | Retrieves all job applications |
| POST | `/applications` | Creates a new job application |
| PATCH | `/applications/<id>` | Updates an existing job application |
| DELETE | `/applications/<id>` | Deletes an application by ID |
| DELETE | `/applications/delete` | Deletes all applications |

## Project Structure

```text
Job Applications Tracker/
├── static/
│   ├── images/
│   ├── app.js
│   └── style.css
├── templates/
│   └── index.html
├── .gitignore
├── app.py
├── changelog.md
├── database.py
├── init_db.py
├── logic.py
├── README.md
├── requirements.txt
└── schema.sql
```

## Future Improvements

### v2.0

- Dashboard improvements
- Application statistics
- Search
- Filtering
- Sorting
- Improved UI
- Empty, loading, and error states

### v3.0

- Deployment
- User registration
- Login and logout
- Password hashing
- Sessions
- User/application relationship

### v4.0

- Follow-up dates
- Reminder system
- Email notifications

## Author

**Vhusa Chipiro (Blackbottt)**