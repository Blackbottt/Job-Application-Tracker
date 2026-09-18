CREATE TABLE IF NOT EXISTS job_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    application_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Wishlisted',
    notes TEXT,
    job_posting_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
