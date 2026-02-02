// Auth JavaScript for DriveWell Login

const API_BASE_URL = '/api/v1';

// UI State
let currentTab = 'company';
let currentSubTab = 'login';

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
    checkExistingSession();
});

async function checkExistingSession() {
    const token = localStorage.getItem('drivewell_token');
    const userType = localStorage.getItem('drivewell_user_type');

    if (token && userType) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Token is valid, redirect to appropriate dashboard
                redirectToDashboard(userType);
                return;
            }
        } catch (error) {
            console.error('Session check failed:', error);
        }

        // Clear invalid session
        clearSession();
    }
}

function clearSession() {
    localStorage.removeItem('drivewell_token');
    localStorage.removeItem('drivewell_refresh_token');
    localStorage.removeItem('drivewell_user_type');
    localStorage.removeItem('drivewell_user');
}

function saveSession(data) {
    localStorage.setItem('drivewell_token', data.session.accessToken);
    localStorage.setItem('drivewell_refresh_token', data.session.refreshToken);
    localStorage.setItem('drivewell_user_type', data.userType);
    localStorage.setItem('drivewell_user', JSON.stringify(data.user));
}

function redirectToDashboard(userType) {
    if (userType === 'company') {
        window.location.href = '/company/';
    } else {
        window.location.href = '/customer/';
    }
}

// Tab switching
function switchTab(tab) {
    currentTab = tab;

    const tabCompany = document.getElementById('tabCompany');
    const tabCustomer = document.getElementById('tabCustomer');
    const companyForm = document.getElementById('companyForm');
    const customerForm = document.getElementById('customerForm');

    hideMessages();

    if (tab === 'company') {
        tabCompany.className = 'flex-1 py-4 text-sm font-semibold uppercase tracking-wide transition-all tab-active';
        tabCustomer.className = 'flex-1 py-4 text-sm font-semibold uppercase tracking-wide transition-all tab-inactive';
        companyForm.classList.remove('hidden');
        customerForm.classList.add('hidden');
    } else {
        tabCompany.className = 'flex-1 py-4 text-sm font-semibold uppercase tracking-wide transition-all tab-inactive';
        tabCustomer.className = 'flex-1 py-4 text-sm font-semibold uppercase tracking-wide transition-all tab-active';
        companyForm.classList.add('hidden');
        customerForm.classList.remove('hidden');
    }
}

function switchSubTab(subTab) {
    currentSubTab = subTab;

    const subTabLogin = document.getElementById('subTabLogin');
    const subTabRegister = document.getElementById('subTabRegister');
    const loginForm = document.getElementById('customerLoginForm');
    const registerForm = document.getElementById('customerRegisterForm');

    hideMessages();

    if (subTab === 'login') {
        subTabLogin.className = 'flex-1 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700';
        subTabRegister.className = 'flex-1 py-2 text-sm font-medium rounded-lg text-slate-500 hover:bg-slate-50';
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        subTabLogin.className = 'flex-1 py-2 text-sm font-medium rounded-lg text-slate-500 hover:bg-slate-50';
        subTabRegister.className = 'flex-1 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700';
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }
}

// Message display
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorDiv.classList.remove('hidden');

    // Auto hide after 5 seconds
    setTimeout(hideMessages, 5000);
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    successText.textContent = message;
    successDiv.classList.remove('hidden');
}

function hideMessages() {
    document.getElementById('errorMessage').classList.add('hidden');
    document.getElementById('successMessage').classList.add('hidden');
}

// Loading state
function setLoading(buttonId, spinnerId, textId, isLoading) {
    const button = document.getElementById(buttonId);
    const spinner = document.getElementById(spinnerId);
    const text = document.getElementById(textId);

    if (isLoading) {
        button.disabled = true;
        spinner.classList.remove('hidden');
        text.textContent = 'Caricamento...';
    } else {
        button.disabled = false;
        spinner.classList.add('hidden');
        text.textContent = buttonId.includes('register') ? 'Registrati' : 'Accedi';
    }
}

// Company Login
async function handleCompanyLogin(event) {
    event.preventDefault();
    hideMessages();

    const email = document.getElementById('companyEmail').value;
    const password = document.getElementById('companyPassword').value;

    setLoading('companySubmit', 'companySpinner', 'companySubmitText', true);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Errore durante il login');
        }

        if (data.data.userType !== 'company') {
            throw new Error('Questo account non ha accesso aziendale');
        }

        saveSession(data.data);
        redirectToDashboard('company');

    } catch (error) {
        showError(error.message);
    } finally {
        setLoading('companySubmit', 'companySpinner', 'companySubmitText', false);
    }
}

// Customer Login
async function handleCustomerLogin(event) {
    event.preventDefault();
    hideMessages();

    const email = document.getElementById('customerEmail').value;
    const password = document.getElementById('customerPassword').value;

    setLoading('customerSubmit', 'customerSpinner', 'customerSubmitText', true);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Errore durante il login');
        }

        if (data.data.userType !== 'customer') {
            throw new Error('Questo account non ha accesso cliente');
        }

        saveSession(data.data);
        redirectToDashboard('customer');

    } catch (error) {
        showError(error.message);
    } finally {
        setLoading('customerSubmit', 'customerSpinner', 'customerSubmitText', false);
    }
}

// Customer Register
async function handleCustomerRegister(event) {
    event.preventDefault();
    hideMessages();

    const fullName = document.getElementById('registerFullName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const phone = document.getElementById('registerPhone').value;
    const driverLicenseNumber = document.getElementById('registerLicenseNumber').value;
    const driverLicenseYears = document.getElementById('registerLicenseYears').value;
    const registrationCode = document.getElementById('registerCode').value;

    setLoading('registerSubmit', 'registerSpinner', 'registerSubmitText', true);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register/customer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                fullName,
                phone: phone || undefined,
                driverLicenseNumber: driverLicenseNumber || undefined,
                driverLicenseYears: driverLicenseYears ? parseInt(driverLicenseYears) : undefined,
                registrationCode
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Errore durante la registrazione');
        }

        // Save session and redirect
        saveSession({
            userType: 'customer',
            user: data.data.user,
            session: data.data.session
        });

        showSuccess('Registrazione completata! Reindirizzamento...');

        setTimeout(() => {
            redirectToDashboard('customer');
        }, 1500);

    } catch (error) {
        showError(error.message);
    } finally {
        setLoading('registerSubmit', 'registerSpinner', 'registerSubmitText', false);
    }
}
