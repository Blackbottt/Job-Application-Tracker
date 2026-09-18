const table = document.getElementById('applications-table');
const applicationsForm = document.getElementById('applications-form');
const applicationId = document.getElementById('application-id');
const company = document.getElementById('company');
const position = document.getElementById('position');
const applicationDate = document.getElementById('application-date');
const status = document.getElementById('status');

function addApplication() {
    const inputs = document.querySelectorAll('input-field');
    
    inputs.forEach(input => {
        input.addEventListener('submit', e => {
            e.preventDefault();
        })  
    })
  
}
