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
            ID:  applicationId,
            Company: company,
            Position: position,
            Application_Date: applicationDate,
            Status: statusOfApplication
        })
    });
  
}
