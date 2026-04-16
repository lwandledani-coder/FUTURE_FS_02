// DOM elements
const logregBox = document.querySelector('.logreg-box');
const signUpLink = document.querySelector('.register-link'); // "Sign up" link in login form
const signInLink = document.querySelector('.login-link'); // "Sign in" link in register form
const mainContainer = document.getElementById('mainContainer');
const dashboardSection = document.getElementById('dashboard-section');
const loginErrorDiv = document.getElementById('loginError');
const regErrorDiv = document.getElementById('regError');

// Toggle between login and register forms
if (signUpLink) {
    signUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        logregBox.classList.add('active');   // show register form
    });
}

if (signInLink) {
    signInLink.addEventListener('click', (e) => {
        e.preventDefault();
        logregBox.classList.remove('active'); // show login form
    });
}

// Handle Login
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (res.ok) {
            // Hide the main container and show dashboard
            mainContainer.style.display = 'none';
            dashboardSection.style.display = 'block';
            document.getElementById('mainHeader').style.display = 'none';
            loadLeads();
        } else {
            loginErrorDiv.innerText = 'Invalid credentials. Use admin@crm.com / admin123';
        }
    } catch (err) {
        loginErrorDiv.innerText = 'Server error. Please try again.';
    }
});

// Handle Register
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    regErrorDiv.innerText = 'Registration is disabled in this demo. Use admin@crm.com / admin123 to login.';
});

// Logout
async function logout() {
    await fetch('/logout', { method: 'POST' });
    mainContainer.style.display = 'block';
    dashboardSection.style.display = 'none';
    document.getElementById('mainHeader').style.display = 'flex';
    // Clear any login error
    if (loginErrorDiv) loginErrorDiv.innerText = '';
    // Optionally reset login form fields
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

// Attach logout button
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) logoutBtn.onclick = logout;

// Load leads and populate table
async function loadLeads() {
    const res = await fetch('/leads');
    const leads = await res.json();
    const tbody = document.querySelector('#leads-table tbody');
    tbody.innerHTML = '';
    leads.forEach(lead => {
        const row = tbody.insertRow();
        row.insertCell(0).innerText = lead.name;
        row.insertCell(1).innerText = lead.email;
        row.insertCell(2).innerText = lead.source || 'website';
        row.insertCell(3).innerText = lead.priority || 'medium';
        row.insertCell(4).innerText = (lead.tags || []).join(', ');
        row.insertCell(5).innerText = lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : '-';
        
        // Status dropdown
        const statusCell = row.insertCell(6);
        const statusSelect = document.createElement('select');
        ['new', 'contacted', 'converted', 'lost'].forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            if (lead.status === opt) option.selected = true;
            statusSelect.appendChild(option);
        });
        statusCell.appendChild(statusSelect);
        
        // Notes input
        const notesCell = row.insertCell(7);
        const notesInput = document.createElement('input');
        notesInput.type = 'text';
        notesInput.value = lead.notes || '';
        notesInput.placeholder = 'Add note...';
        notesCell.appendChild(notesInput);
        
        // Save button
        const actionsCell = row.insertCell(8);
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.onclick = async () => {
            const updatedLead = {
                status: statusSelect.value,
                notes: notesInput.value,
                source: lead.source,
                priority: lead.priority,
                tags: lead.tags,
                followUpDate: lead.followUpDate
            };
            await fetch(`/leads/${lead._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedLead)
            });
            loadLeads();
        };
        actionsCell.appendChild(saveBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.background = '#8105ed';
        deleteBtn.style.marginLeft = '8px';
        deleteBtn.onclick = async () => {
        if (confirm(`Are you sure you want to delete lead "${lead.name}"?`)) {
            const res = await fetch(`/leads/${lead._id}`, { method: 'DELETE' });
            if (res.ok) {
            loadLeads();  // refresh the table
            } else {
            alert('Failed to delete lead');
            }
        }
        };
        actionsCell.appendChild(deleteBtn);
    });
}


// Theme toggle functionality
const themeToggleBtn = document.getElementById('theme-toggle');

// Check for saved theme preference
const savedTheme = localStorage.getItem('crm_theme');
if (savedTheme === 'light' && dashboardSection) {
    dashboardSection.classList.add('light-mode');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light';
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        dashboardSection.classList.toggle('light-mode');
        if (dashboardSection.classList.contains('light-mode')) {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light';
            localStorage.setItem('crm_theme', 'light');
        } else {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Dark';
            localStorage.setItem('crm_theme', 'dark');
        }
    });
}

// Add new lead
const addLeadBtn = document.getElementById('add-lead-btn');
if (addLeadBtn) {
    addLeadBtn.onclick = async () => {
        const name = document.getElementById('lead-name').value.trim();
        const email = document.getElementById('lead-email').value.trim();
        if (!name || !email) {
            alert('Name and email are required');
            return;
        }
        const source = document.getElementById('lead-source').value;
        const priority = document.getElementById('lead-priority').value;
        const tagsInput = document.getElementById('lead-tags').value;
        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];
        const followUpDate = document.getElementById('lead-followup').value || null;

        const res = await fetch('/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, source, priority, tags, followUpDate })
        });
        if (res.ok) {
            // Clear form
            document.getElementById('lead-name').value = '';
            document.getElementById('lead-email').value = '';
            document.getElementById('lead-source').value = 'website';
            document.getElementById('lead-priority').value = 'medium';
            document.getElementById('lead-tags').value = '';
            document.getElementById('lead-followup').value = '';
            loadLeads();
        } else {
            alert('Failed to add lead');
        }
    };
}