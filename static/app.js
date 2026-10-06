const applicationSearch = document.getElementById('search-applications');
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

const addApplication = document.querySelector('.submit-add-applications');
const editApplication = document.querySelector('.submit-edit-applications');
const deleteAllApplications = document.querySelector('.submit-delete-applications');
const statisticsTotal = document.querySelector('.total-applications .statistic-total');
const statisticsApplied = document.querySelector('.applied-applications .statistic-total');
const statisticsInterviewed = document.querySelector('.interviewed-applications .statistic-total');
const statisticsOffers = document.querySelector('.offers-applications .statistic-total');

const cancelForm = document.createElement('button');
const clearForm = document.createElement('button');
const saveApplication = document.createElement('button');
const updateApplication = document.createElement('button');
const editOrDeleteId = document.createElement('input');
const deleteApplication = document.createElement('button');
const applicationSearch2 = document.createElement('input');
const selectFilter = document.createElement('select');
const sortBySelect = document.createElement('select');
const sortByDateOption = document.createElement('option');
const sortByCompanyOption = document.createElement('option'); 
const sortByPositionOption = document.createElement('option');
const selectFilterWishlist = document.createElement('option');
const selectFilterApplied = document.createElement('option');
const selectFilterInterview = document.createElement('option');
const selectFilterOffer = document.createElement('option');
const selectFilterAccepted = document.createElement('option');
const selectFilterRejected = document.createElement('option');
const selectFilterWithdrawn = document.createElement('option');

let searchTimeout;

const state = {
    applications: [],
    search: "",
    filter: "all",
    sort: "date-desc"
};

async function loadApplication(param = false) {
    let applications;

    if (param) {
        applications = param;
        // console.log("applications from search", applications);
    } else {
        const response = await fetch('/applications');
        applications = await response.json();
        applications = applications.applications; // Access the 'applications' property from the response
        // console.log("applications", applications);
    } 

    state.applications = applications; // Update the state with the loaded applications

    getStatistics(applications);
    loadDashboard(applications);
}

async function getSearchRequest(){
    // console.log("searching for applications");
    const searchQuery = applicationSearch.value.trim() || applicationSearch2.value.trim();

    if (!searchQuery) {
        // console.log("search query is empty, loading all applications");
        await loadApplication(); // Load all applications if search query is empty
        return;
    }

    const params = new URLSearchParams({ query: searchQuery });
    // console.log("fetching for applications: ", params);
    const searchResponse = await fetch('/applications?' + params.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }); 
    // console.log("searchResponse", searchResponse.json());
    const searchResults = await searchResponse.json();
    // if (!searchResponse.ok) {
        // throw new Error(`Server responded with ${searchResponse.status} ${searchResponse.statusText}`);
    // }
    // console.log("searchResults", searchResults);
    await loadApplication(searchResults.applications);
}

function sortApplications(applications, sortBy) {
    let sortedApplications = [...applications]; // Create a copy of the applications array
    return sortedApplications.sort((a, b) => {
        if (sortBy === 'date') {    
            return new Date(b.job_application_date) - new Date(a.job_application_date);
        }
        return 0;
    });
}

function getStatistics(applications) {
    const totalApplications = applications.length;
    const appliedApplications = applications.filter(app => app.status === 'Applied').length;
    const interviewedApplications = applications.filter(app => app.status === 'Interview').length;
    const offersApplications = applications.filter(app => app.status === 'Offer').length;

    statisticsTotal.textContent = totalApplications === undefined ? 0 : totalApplications;
    statisticsApplied.textContent = appliedApplications === undefined ? 0 : appliedApplications;
    statisticsInterviewed.textContent = interviewedApplications === undefined ? 0 : interviewedApplications;
    statisticsOffers.textContent = offersApplications === undefined ? 0 : offersApplications;
}

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

function loadDashboard(applications){
    const table = document.createElement('table');
    const caption = document.createElement('caption');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tableHeader = document.createElement('tr');
    const dashboardFilters = document.createElement('div');
    // const applicationSearch2 = document.createElement('input');
    // const selectFilter = document.createElement('select');
    

    applicationSearch2.type = 'search';
    applicationSearch2.name = 'search-applications';
    applicationSearch2.id = 'search-application';
    applicationSearch2.classList.add('search-applications');
    applicationSearch2.placeholder = 'Search company, position or platform...';
    sortBySelect.name = 'sort-by';
    sortBySelect.id = 'sort-by';
    sortBySelect.classList.add('input-field');
    sortByDateOption.value = 'date';
    sortByDateOption.textContent = 'Sort by Date';
    sortByCompanyOption.value = 'company';
    sortByCompanyOption.textContent = 'Sort by Company';
    sortByPositionOption.value = 'position';
    sortByPositionOption.textContent = 'Sort by Position';
    
    selectFilter.name = 'dashboard-status';
    selectFilter.id = 'dashboard-status';
    selectFilter.classList.add('input-field');
    selectFilter.placeholder = 'All Statuses';
    selectFilterWishlist.value = 'Wishlist';
    selectFilterWishlist.textContent = 'Wishlist';
    selectFilterApplied.value = 'Applied';
    selectFilterApplied.textContent = 'Applied';
    selectFilterInterview.value = 'Interview';
    selectFilterInterview.textContent = 'Interview';
    selectFilterOffer.value = 'Offer';
    selectFilterOffer.textContent = 'Offer';
    selectFilterAccepted.value = 'Accepted';
    selectFilterAccepted.textContent = 'Accepted';
    selectFilterRejected.value = 'Rejected';
    selectFilterRejected.textContent = 'Rejected';
    selectFilterWithdrawn.value = 'Withdrawn';
    selectFilterWithdrawn.textContent = 'Withdrawn';

    sortBySelect.appendChild(sortByDateOption);
    sortBySelect.appendChild(sortByCompanyOption);
    sortBySelect.appendChild(sortByPositionOption);
    selectFilter.appendChild(selectFilterWishlist);
    selectFilter.appendChild(selectFilterApplied);
    selectFilter.appendChild(selectFilterInterview);
    selectFilter.appendChild(selectFilterOffer);
    selectFilter.appendChild(selectFilterAccepted);
    selectFilter.appendChild(selectFilterRejected);
    selectFilter.appendChild(selectFilterWithdrawn);

    dashboardFilters.classList.add('dashboard-filtering');
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
        console.log("applications length", typeof applications);
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
                application.job_posting_url
            ];
            values.forEach(value => {
                const tableRowCell = document.createElement('td');
                tableRowCell.textContent = value;
                tableRow.appendChild(tableRowCell);
            });
            tbody.appendChild(tableRow);
        });
    }

    dashboardFilters.appendChild(applicationSearch2);
    dashboardFilters.appendChild(sortBySelect);
    dashboardFilters.appendChild(selectFilter);
    table.appendChild(tbody);
    dashboard.innerHTML = '';
    dashboard.appendChild(dashboardFilters);
    dashboard.appendChild(table);
}


async function addOrEditForm(formType) {    
    inputSection.classList.remove('input-section-off');
    inputSection.classList.add('input-section-on');
    cancelForm.classList.add('form-button');
    clearForm.classList.add('form-button');
    saveApplication.classList.add('form-button');
    updateApplication.classList.add('form-button');
    deleteApplication.classList.add('form-button');
    editOrDeleteId.classList.add('id-edit-delete');
    // deleteApplication.classList.add('submit-delete-application');

    cancelForm.textContent = 'Cancel';
    clearForm.textContent = 'Clear Form';
    saveApplication.textContent = 'Save Application';
    updateApplication.textContent = 'Update Application';
    editOrDeleteId.placeholder = 'ID: Edit/Delete';
    deleteApplication.textContent = 'Delete';
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
    } 
    
    if (formType == 'edit') {
        buttonFeatures.appendChild(deleteApplication);
        buttonFeatures.appendChild(cancelForm);
        buttonFeatures.appendChild(updateApplication);
        applicationsForm.appendChild(editOrDeleteId);
    }
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

addApplication.addEventListener("click", async () => {
    await addOrEditForm('add');
});

editApplication.addEventListener("click", async e => {
    await addOrEditForm('edit');
});

deleteAllApplications.addEventListener("click", async () => {
    const response = await fetch('/applications/delete', {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error(`Server responded with ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    await loadApplication();
});

cancelForm.addEventListener("click", () => {
    cancelFormfunc();
});

clearForm.addEventListener("click", () => {
    const formFields = applicationsForm.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.value = "";
    });
});

saveApplication.addEventListener("click", async () => {
    await addJobApplication();
    cancelFormfunc();
    await loadApplications();
});

updateApplication.addEventListener("click", async () => {
    await editJobApplication();
    cancelFormfunc();
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

applicationSearch.addEventListener("input", handleSearch);
applicationSearch2.addEventListener("input", handleSearch);
selectFilter.addEventListener("change", handleSearch);

function handleSearch(event) {    
    console.log("input event", Date.now());
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        console.log("debounced call", Date.now());
        await getSearchRequest();
    }, 800); // Debounce delay  
}

sortBySelect.addEventListener("change", async () => {
    const sortBy = sortBySelect.value;
    const response = await fetch('/applications');
    let applications = await response.json();
    applications = applications.applications;
    applications = sortApplications(applications, sortBy);
    loadApplication(applications);
});

function cancelFormfunc(){
    inputSection.classList.remove('input-section-on');
    inputSection.classList.add('input-section-off');
    buttonFeatures.replaceChildren();    
}

loadApplication();
