CREATE TABLE IF NOT EXISTS job_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_application_date DATE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    application_platform VARCHAR(255) NOT NULL,
    job_starting_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Wishlisted',
    notes TEXT,
    job_posting_url VARCHAR(255)
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
