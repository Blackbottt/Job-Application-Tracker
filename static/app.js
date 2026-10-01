const inputSection = document.getElementById('input-section');
const applicationsForm = document.getElementById('applications-form');
const jobApplicationDate = document.getElementById('date-applied');
const company_name = document.getElementById('company');
const position = document.getElementById('position');
const applicationPlatform = document.getElementById('application-platform');
const jobStartingDate = document.getElementById('job-start-date');
const statusOfApplication = document.getElementById('status');
const job_posting_url = document.getElementById('job-url');
const notes = document.getElementById('notes');
const buttonFeatures = document.getElementById('button-features');
const dashboard = document.getElementById('dashboard');
const applicationSearch = document.getElementById('search-applications');

const addApplication = document.querySelector('.submit-add-applications');
const editApplication = document.querySelector('.submit-edit-applications');
const deleteAllApplications = document.querySelector('.submit-delete-applications');

const cancelForm = document.createElement('button');
const clearForm = document.createElement('button');
const saveApplication = document.createElement('button');
const updateApplication = document.createElement('button');
const editOrDeleteId = document.createElement('input');
const deleteApplication = document.createElement('button');

async function addJobApplication() {
    console.log("5 for start add");
    await fetch('/applications', {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            job_application_date: jobApplicationDate.value,
            company_name: company_name.value,
            position: position.value,
            status: statusOfApplication.value,
            platform_applied: applicationPlatform.value,
            job_starting_date: jobStartingDate.value,
            job_posting_url: job_posting_url.value,
            notes: notes.value
        })
    });
    console.log("55 for end add");
}

async function editJobApplication() {
    const applicationId = editOrDeleteId.value;
    const data = {};

    if (jobApplicationDate.value.trim() !== "") data.job_application_date = jobApplicationDate.value;
    if (company_name.value.trim() !== "") data.company_name = company_name.value;
    if (position.value.trim() !== "") data.position = position.value;
    if (statusOfApplication.value.trim() !== "") data.status = statusOfApplication.value;
    if (applicationPlatform.value.trim() !== "") data.platform_applied = applicationPlatform.value;
    if (jobStartingDate.value.trim() !== "") data.job_starting_date = jobStartingDate.value;
    if (job_posting_url.value.trim() !== "") data.job_posting_url = job_posting_url.value;
    if (notes.value.trim() !== "") data.notes = notes.value;

    const response = await fetch(`/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Server responded with ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
}

async function loadApplications() {
    const response = await fetch('/applications');
    const applications = await response.json();

    const table = document.createElement('table');
    const caption = document.createElement('caption');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tableHeader = document.createElement('tr');

    table.classList.add('applications-table');
    caption.classList.add('applications-caption');
    thead.classList.add('applications-thead');
    tbody.classList.add('applications-tbody');
    caption.textContent = 'Job Applications';

    const headers = [
        'ID',
        'Date Applied',
        'Company',
        'Position',
        'Application Platform',
        'Start Date',
        'Status',
        'Notes',
        'Job URL'
    ];

    headers.forEach(header => {
        const tableHeading = document.createElement('th');
        tableHeading.textContent = header;
        tableHeading.classList.add('table-header');
        tableHeader.appendChild(tableHeading);
    });

    thead.appendChild(tableHeader);
    table.appendChild(caption);
    table.appendChild(thead);

    if (applications) {
        applications.forEach(application => {
            const tableRow = document.createElement('tr');
            const values = [
                application.id,
                application.job_application_date,
                application.company_name,
                application.position,
                application.application_platform,
                application.job_starting_date,
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
            tbody.appendChild(tableRow);
        });
    }

    table.appendChild(tbody);
    dashboard.innerHTML = '';
    dashboard.appendChild(table);
    jobApplicationDate.value = "";
    company_name.value = "";
    position.value = "";
    applicationPlatform.value = "";
    jobStartingDate.value = "";
    statusOfApplication.value = "";
    job_posting_url.value = "";
    notes.value = "";
    editOrDeleteId.value = "";
}

async function addOrEditForm(formType) {    

    inputSection.classList.remove('input-section-off');
    inputSection.classList.add('input-section-on');
    cancelForm.classList.add('form-button');
    clearForm.classList.add('form-button');
    saveApplication.classList.add('form-button');
    updateApplication.classList.add('form-button');

    cancelForm.textContent = 'cancel Form';

    
    // deleteAllApplications.textContent = 'Delete All Applications';
    // deleteAllApplications.classList.add('submit-delete-applications');
    // buttonFeatures.appendChild(editOrDeleteId);
    // buttonFeatures.appendChild(editApplication);
    // buttonFeatures.appendChild(deleteApplication);
    // buttonFeatures.appendChild(deleteAllApplications);
    if (formType == 'add') {
        buttonFeatures.appendChild(clearForm);
        buttonFeatures.appendChild(cancelForm);
        buttonFeatures.appendChild(saveApplication);
        await addJobApplication();
        console.log("HINZUFUGENDE: ");
    } 
    
    if (formType == 'edit') {
        editOrDeleteId.placeholder = 'ID: Edit/Delete'
        editApplication.textContent = 'Edit Application';
        updateApplication.textContent = 'Update Application'
        deleteApplication.textContent = 'Delete Application';

        editOrDeleteId.classList.add('id-edit-delete');
        editApplication.classList.add('submit-edit-applications');
        deleteApplication.classList.add('submit-delete-application');

        buttonFeatures.appendChild(deleteApplication);
        buttonFeatures.appendChild(cancelForm);
        buttonFeatures.appendChild(updateApplication);
        await editJobApplication();

    }
}

addApplication.addEventListener("click", async () => {
    await addOrEditForm('add');
    await loadApplications();
});

editApplication.addEventListener("click", async e => {
    await addOrEditForm('edit');
    await loadApplications();
});

deleteApplication.addEventListener("click", async () => {
    const applicationId = editOrDeleteId.value;
    const response = await fetch(`/applications/${applicationId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error(`Server responded with ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();

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

    await loadApplications();
});

loadApplications();
