const applicationsForm = document.getElementById('applications-form');
const company_name = document.getElementById('company');
const position = document.getElementById('position');
const applicationDate = document.getElementById('application-date');
const statusOfApplication = document.getElementById('status');
const job_posting_url = document.getElementById('job-url');
const notes = document.getElementById('notes');
const addApplication = document.querySelector('.submit-add-applications');
const buttonFeatures = document.getElementById('button-features');
const editOrDeleteId = document.createElement('input');
const editApplication = document.createElement('button');
const deleteApplication = document.createElement('button');
const deleteAllApplications = document.createElement('button');
const dashboard = document.getElementById('dashboard');

editOrDeleteId.classList.add('id-edit/delete');
editApplication.classList.add('submit-edit-applications');
deleteApplication.classList.add('submit-delete-application');
deleteAllApplications.classList.add('submit-delete-applications');
editOrDeleteId.placeholder = 'ID: Edit/Delete'
editApplication.textContent = 'Edit Application';
deleteApplication.textContent = 'Delete Application';
deleteAllApplications.textContent = 'Delete All Applications';
buttonFeatures.appendChild(editOrDeleteId);
buttonFeatures.appendChild(editApplication);
buttonFeatures.appendChild(deleteApplication);
buttonFeatures.appendChild(deleteAllApplications);


async function addJobApplication() {
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

    if (applications) {
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
    }
    
    dashboard.innerHTML = '';
    dashboard.appendChild(table);
    console.log("App: ", applications);
}

addApplication.addEventListener("click", async () => {
    await addJobApplication();
    await loadApplications();
});

editApplication.addEventListener("click", async e => {
    const applicationId = editOrDeleteId.value;
    const response = await fetch(`/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
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

    if (!response.ok) {
        throw new Error(`Server responded with ${response.status} ${response.statusText}`);
    }
    const result = await response.json();

    await loadApplications();
});

deleteApplication.addEventListener("click", async () => {
    const applicationId = editOrDeleteId.value;
    console.log("delete id: ", applicationId);
    const response = await fetch(`/applications/${applicationId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Server responded with ${response.status} ${response.statusText}`);
    }
    const result = await response.json();

    console.log("status:", response.status);
    console.log("server response:", result);

    await loadApplications();
});

deleteAllApplications.addEventListener("click", async () => {
    const response = await fetch('/applications/delete', {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Server responded with ${response.status} ${response.statusText}`);
    }
    const result = await response.json();

    console.log("status:", response.status);
    console.log("server response:", result);    
    await loadApplications();
});

loadApplications();
