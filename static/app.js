const applicationsForm = document.getElementById('applications-form');
const company = document.getElementById('company');
const position = document.getElementById('position');
const applicationDate = document.getElementById('application-date');
const statusOfApplication = document.getElementById('status');
const jobUrl = document.getElementById('job-url');
const notes = document.getElementById('notes');
const dashboard = document.getElementById('dashboard');

async function addApplication() {
    await fetch('/applications', {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            company: company.value,
            position: position.value,
            status: statusOfApplication.value,
            date_applied: applicationDate.value,
            job_Url: jobUrl.value,
            notes: notes.value
        })
    });
}

async function loadApplications() {
    const response = await fetch('/applications');
    const applications = await response.json();

    const table = document.createElement('table');
    const caption = document.createElement('caption');
    const tableHeader = document.createElement('tr');

    table.classList.add('applications-table');
    caption.classList.add('applications-caption');
    tableHeader.classList.add('table-row');
    caption.textContent = 'Job Applications';

    const headers = [
        'ID',
        'Company',
        'Position',
        'Application Date',
        'Status',
        'Notes',
        'Job URL',
        'Created At'
    ];

    headers.forEach(header => {
        const tableHeading = document.createElement('th');
        tableHeading.textContent = header;
        tableHeading.classList.add('table-header');
        tableHeader.appendChild(tableHeading);
    });

    table.appendChild(caption);
    table.appendChild(tableHeader);

    applications.forEach(application => {
        const tableRow = document.createElement('tr');
        const values = [
            application.id,
            application.company,
            application.position,
            application.application_date,
            application.status,
            application.notes,
            application.job_url,
            application.created_at
        ];
        values.forEach(value => {
            const tableRowCell = document.createElement('td');
            tableRowCell.textContent = value;
            tableRow.appendChild(tableRowCell);
        });
        table.appendChild(tableRow);
    });
    dashboard.innerHTML = '';
    dashboard.appendChild(table);
    console.log("App: ", applications);
}

applicationsForm.addEventListener("submit", e => {
    e.preventDefault();
    addApplication();
    loadApplications();
});

loadApplications();
