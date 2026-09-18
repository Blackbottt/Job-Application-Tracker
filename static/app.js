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
