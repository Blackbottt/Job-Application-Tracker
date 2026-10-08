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
const dashboardFilters = document.createElement('div');
const applicationSearch2 = document.createElement('input');
const selectFilter = document.createElement('select');
const sortBySelect = document.createElement('select');

let searchTimeout;

const state = {
    applications: [],
    search: "",
    filter: "all",
    sort: "date-desc"
};

async function renderApplication() {
    const response = await fetch('/applications');
    data = await response.json();

    state.applications = data.applications; // Access the 'applications' property from the response

    updateDashboard();
}

function updateDashboard() {
    const applications = [...state.applications];
    const statistics = getStatistics(applications);

    statisticsTotal.textContent = statistics.total;
    statisticsApplied.textContent = statistics.applied;
    statisticsInterviewed.textContent = statistics.interviewed;
    statisticsOffers.textContent = statistics.offers;
    applications = getProcessedApplications(applications);
    loadDashboard(applications);
}

function getStatistics(applications) {
    const totalApplications = applications.length;
    const appliedApplications = applications.filter(app => app.status === 'Applied').length;
    const interviewedApplications = applications.filter(app => app.status === 'Interview').length;
    const offersApplications = applications.filter(app => app.status === 'Offer').length;

    return {
        total: totalApplications,
        applied: appliedApplications,
        interviewed: interviewedApplications,
        offers: offersApplications
    };
}

function loadDashboard(applications){
    dashboard.innerHTML = '';
    renderDashboardFilters();
    renderTable(applications);
}

function renderDashboardFilters() {
    applicationSearch2.placeholder = 'Search company, position or platform...';
    applicationSearch2.type = 'search';
    applicationSearch2.name = 'search-applications';
    sortBySelect.name = 'sort-by';
    selectFilter.name = 'dashboard-status';
    
    applicationSearch2.id = 'search-application';
    sortBySelect.id = 'sort-by';
    selectFilter.id = 'dashboard-status';
    
    applicationSearch2.classList.add('search-applications');
    sortBySelect.classList.add('input-field');
    selectFilter.classList.add('input-field');
    dashboardFilters.classList.add('dashboard-filtering');

    configurator();

    dashboardFilters.appendChild(applicationSearch2);
    dashboardFilters.appendChild(sortBySelect);
    dashboardFilters.appendChild(selectFilter);
    dashboard.appendChild(dashboardFilters);
}

function configurator() {
    const config = {
        statuses: [
            'Wishlist', 
            'Applied', 
            'Interview', 
            'Offer', 
            'Accepted', 
            'Rejected', 
            'Withdrawn'
        ],
        sortOptions: [
            'date', 
            'company', 
            'position'
        ],
        filterOptions: [
            'all', 
            'wishlist', 
            'applied', 
            'interview', 
            'offer', 
            'accepted', 
            'rejected', 
            'withdrawn'
        ]
    };

    if (sortBySelect.length === 0 && selectFilter.length === 0) {
        config.sortOptions.forEach(sortOption => {
            const option = document.createElement("option");

            option.value = sortOption;
            option.textContent = sortOption;

            sortBySelect.appendChild(option);
        });

        config.filterOptions.forEach(filterOption => {
            const option = document.createElement("option");

            option.value = filterOption;
            option.textContent = filterOption;

            selectFilter.appendChild(option);
        });
    }
}

function renderTable(applications) {
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
    
    const columns = [
        { key: "id", label: "ID" },
        { key: "job_application_date", label: "Date Applied" },
        { key: "company_name", label: "Company" },
        { key: "position", label: "Position" },
        { key: "application_platform", label: "Application Platform" },
        { key: "job_starting_date", label: "Start Date" },
        { key: "status", label: "Status" },
        { key: "notes", label: "Notes" },
        { key: "job_posting_url", label: "Job URL" }
    ];

    columns.forEach(column => {
        const tableHeading = document.createElement('th');
        tableHeading.textContent = column.label;
        tableHeading.classList.add('table-header');
        tableHeader.appendChild(tableHeading);
    });

    thead.appendChild(tableHeader);
    table.appendChild(caption);
    table.appendChild(thead);

    if (applications) {
        applications.forEach(application => {
            const tableRow = document.createElement('tr');
            columns.forEach(column => {
                const tableRowCell = document.createElement('td');
                tableRowCell.textContent = application[column.key] ?? "";
                tableRow.appendChild(tableRowCell);
            });
            tbody.appendChild(tableRow);
        });
    }

    table.appendChild(tbody);
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

    cancelForm.textContent = 'Cancel';
    clearForm.textContent = 'Clear Form';
    saveApplication.textContent = 'Save Application';
    updateApplication.textContent = 'Update Application';
    editOrDeleteId.placeholder = 'ID: Edit/Delete';
    deleteApplication.textContent = 'Delete';

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

function cancelFormfunc(){
    inputSection.classList.remove('input-section-on');
    inputSection.classList.add('input-section-off');
    buttonFeatures.replaceChildren();    
}

async function addJobApplication() {
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

}

function handleSearch(event) {    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        state.search = event.target.value.trim();
        await getProcessedApplications("search");
    }, 800); // Debounce delay  
}

async function getProcessedApplications(applications) {
    let processedApplications = [...state.applications];
    
    processedApplications = await searchApplications();
    processedApplications = filterApplications(processedApplications, state.filter);
    processedApplications = sortApplications(processedApplications, state.sort);

    return processedApplications;
}

async function searchApplications(){
    const searchQuery = applicationSearch.value.trim() || applicationSearch2.value.trim();

    if (!searchQuery) {
        await renderApplication(); // Load all applications if search query is empty
        return;
    }

    const params = new URLSearchParams({ query: searchQuery });
    const searchResponse = await fetch('/applications?' + params.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }); 
    const searchResults = await searchResponse.json();
    if (!searchResponse.ok) {
        throw new Error(`Server responded with ${searchResponse.status} ${searchResponse.statusText}`);
    }
    return searchResults.applications; 
}

function sortApplications(applications, sortBy) {
    let sortedApplications = [...applications]; // Create a copy of the applications array
    const sortFunctions = {
        'date': (a, b) => new Date(b.job_application_date) - new Date(a.job_application_date),
        'company': (a, b) => a.company_name.localeCompare(b.company_name),
        'position': (a, b) => a.position.localeCompare(b.position)
    };
    const sortFunction = sortFunctions[sortBy] || ((a, b) => 0);
    return sortedApplications.sort(sortFunction);
}

function filterApplications(applications, status) {
    let filteredApplications = [...applications]; // Create a copy of the applications array

    if (!status || status === "all") {
        return applications;
    }

    return filteredApplications.filter(
        application => application.status.toLowerCase() === status.toLowerCase()
    );
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

    await renderApplication();
});

deleteApplication.addEventListener("click", async () => {
    const applicationId = editOrDeleteId.value;
    const response = await fetch(`/applications/${applicationId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error(`Server responded with ${response.status} ${response.statusText}`);
    }

    await renderApplication();
});

clearForm.addEventListener("click", () => {
    const formFields = applicationsForm.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.value = "";
    });
});

cancelForm.addEventListener("click", () => {
    cancelFormfunc();
});

saveApplication.addEventListener("click", async () => {
    await addJobApplication();
    cancelFormfunc();
    await renderApplication();
});

updateApplication.addEventListener("click", async () => {
    await editJobApplication();
    cancelFormfunc();
    await renderApplication();
});

applicationSearch.addEventListener("input", handleSearch);
applicationSearch2.addEventListener("input", handleSearch);

sortBySelect.addEventListener("change", async () => {
    const sortBy = sortBySelect.value;
    state.sort = sortBy;
    await renderApplication();
});

selectFilter.addEventListener("change", async () => {
    const filterBy = selectFilter.value;
    state.filter = filterBy;
    await renderApplication();
});

await renderApplication(); 
