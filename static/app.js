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
    const inputs = document.querySelectorAll('.input-field');
    const table = document.createElement('table');
    const caption = document.createElement('caption');
    const tableHeader = document.createElement('th');
    const tableRow = document.createElement('tr');
    table.classList('applications-table');
    caption.classList('applications-caption');
    tableHeader.classList('table-header');
    tableRow.classList('table-row');
    dashboard.appendChild(tableRow);
    tableRow.appendChild(tableHeader).textContent('ID');
    tableRow.appendChild(tableHeader).textContent('Company');
    tableRow.appendChild(tableHeader).textContent('Position');
    tableRow.appendChild(tableHeader).textContent('Application Date');
    tableRow.appendChild(tableHeader).textContent('Status');
    tableRow.appendChild(tableHeader).textContent('Notes');
    tableRow.appendChild(tableHeader).textContent('Job URL');
    tableRow.appendChild(tableHeader).textContent('created at');

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
