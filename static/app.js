const table = document.getElementById('applications-table');
const applicationsForm = document.getElementById('applications-form');
const company = document.getElementById('company');
const position = document.getElementById('position');
const applicationDate = document.getElementById('application-date');
const statusOfApplication = document.getElementById('status');
const dashboard = document.getElementById('dashboard')

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
            date_applied: applicationDate.value
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
    })

    dashboard.appendChild(tableRow);

    inputs.forEach(input => input.innerHTML = '');
    console.log("Apps: ", applications);
    applications.forEach(application => {

    })
}


applicationsForm.addEventListener("submit", e => {
    e.preventDefault();
    addApplication();
    loadApplications();
})
