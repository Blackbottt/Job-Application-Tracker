const table = document.getElementById('applications-table');
const applicationsForm = document.getElementById('applications-form');
const applicationId = document.getElementById('application-id');
const company = document.getElementById('company');
const position = document.getElementById('position');
const applicationDate = document.getElementById('application-date');
const statusOfApplication = document.getElementById('status');

async function addApplication() {
    await fetch('/applications', {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ID:  applicationId.value,
            Company: company.value,
            Position: position.value,
            Application_Date: applicationDate.value,
            Status: statusOfApplication.value
        })
    });
}

async function loadApplications() {
    const response = await fetch('/applications');
    const applications = await response.json();
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach(input => {
        input.innerHTML = '';
    });
    console.log("Apps: ", applications);
    // applications.forEach(application => {

    // })
}

loadApplications();
