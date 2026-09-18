const applicationsForm = document.getElementById('applications-form');
const company_name = document.getElementById('company');
const position = document.getElementById('position');
const applicationDate = document.getElementById('application-date');
const statusOfApplication = document.getElementById('status');
const job_posting_url = document.getElementById('job-url');
const notes = document.getElementById('notes');
const addTask = document.querySelector('submit-add-applications');
const editTask = document.querySelector('submit-edit-applications');
const deleteTask = document.querySelector('submit-delete-applications');
const dashboard = document.getElementById('dashboard');

async function addApplication() {
    await fetch('/applications', {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            company_name: company_name.value,
            position: position.value,
            status: statusOfApplication.value,
            date_applied: applicationDate.value,
            job_posting_url: job_posting_url.value,
            notes: notes.value
        })
    });
}

async function deleteApplication(id) {
    await fetch(f`/applications/delete/${id}`, {
        method: DELETE
    });
    await loadApplications();
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
            application.company_name,
            application.position,
            application.application_date,
            application.status,
            application.notes,
            application.job_posting_url,
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

addTask.addEventListener("click", async (e) => {
    e.preventDefault();
    await addApplication();
    await loadApplications();
});

// editTask.addEventListener("submit", async e => {
//     e.preventDefault();
//     // await Application();
//     await loadApplications();
// });

deleteTask.addEventListener("click", async () => {
    await fetch('/applications/delete', {
        method: DELETE
    });
    await loadApplications();
});

loadApplications();
