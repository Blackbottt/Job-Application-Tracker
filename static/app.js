const table = document.getElementById('applications-table');
const applicationsForm = document.getElementById('applications-form');
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
    inputs.forEach(input => {
        input.innerHTML = '';
    });
    console.log("Apps: ", applications);
    // applications.forEach(application => {

    // })
}

loadApplications();

applicationsForm.addEventListener("submit", e => {
    e.preventDefault();
    addApplication();
})
