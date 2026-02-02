// Company Dashboard JavaScript

const API_BASE_URL = '/api/v1';

// State
let customers = [];
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

async function checkAuth() {
    const token = localStorage.getItem('drivewell_token');
    const userType = localStorage.getItem('drivewell_user_type');

    if (!token || userType !== 'company') {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
        if (!response.ok) throw new Error('Unauthorized');

        const data = await response.json();
        currentUser = data.data.user;
        document.getElementById('userName').textContent = currentUser.fullName || currentUser.email;

        // Load data
        await Promise.all([loadStatistics(), loadCustomers()]);
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.clear();
        window.location.href = '/login.html';
    }
}

function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('drivewell_token');
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

async function loadStatistics() {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/company/statistics`);
        const data = await response.json();

        if (data.success) {
            document.getElementById('statTotalCustomers').textContent = data.data.totalCustomers;
            document.getElementById('statAverageScore').textContent = data.data.averageScore || '-';
            document.getElementById('statHighRisk').textContent = data.data.highRiskCount;
        }
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

async function loadCustomers() {
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const customersTable = document.getElementById('customersTable');

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/company/customers`);
        const data = await response.json();

        if (data.success) {
            customers = data.data;
            loadingState.classList.add('hidden');

            if (customers.length === 0) {
                emptyState.classList.remove('hidden');
                customersTable.classList.add('hidden');
            } else {
                emptyState.classList.add('hidden');
                customersTable.classList.remove('hidden');
                renderCustomers(customers);
            }
        }
    } catch (error) {
        console.error('Failed to load customers:', error);
        loadingState.innerHTML = `
            <div class="text-red-500">
                <i class="bi bi-exclamation-circle text-2xl mb-2"></i>
                <p>Errore nel caricamento dei clienti</p>
            </div>
        `;
    }
}

function renderCustomers(customersToRender) {
    const tbody = document.getElementById('customersBody');
    tbody.innerHTML = '';

    customersToRender.forEach(customer => {
        const profile = customer.driverProfile;
        const hasProfile = profile && profile.overallScore !== null;

        const scoreHtml = hasProfile
            ? `<span class="font-semibold ${getScoreColor(profile.overallScore)}">${profile.overallScore}</span>
               <span class="text-gray-400">/100</span>
               <span class="ml-2 px-2 py-0.5 text-xs font-bold rounded ${getGradeBadgeClass(profile.overallGrade)}">${profile.overallGrade}</span>`
            : '<span class="text-gray-400">N/A</span>';

        const riskHtml = hasProfile
            ? `<span class="px-2 py-1 text-xs font-medium rounded-full ${getRiskBadgeClass(profile.riskLevel)}">${translateRisk(profile.riskLevel)}</span>`
            : '<span class="text-gray-400">-</span>';

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        row.innerHTML = `
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mr-3">
                        <i class="bi bi-person text-slate-500"></i>
                    </div>
                    <div>
                        <div class="font-medium text-gray-900">${customer.fullName}</div>
                        <div class="text-sm text-gray-500">${customer.phone || '-'}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">${customer.email}</td>
            <td class="px-6 py-4">${scoreHtml}</td>
            <td class="px-6 py-4">${riskHtml}</td>
            <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end space-x-2">
                    <button onclick="openDrivingDataModal('${customer.id}', '${customer.fullName}')"
                            class="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                            title="Inserisci dati guida">
                        <i class="bi bi-sliders"></i>
                    </button>
                    <button onclick="openDeleteModal('${customer.id}', '${customer.fullName}')"
                            class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                            title="Elimina">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterCustomers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = customers.filter(c =>
        c.fullName.toLowerCase().includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm)
    );
    renderCustomers(filtered);
}

// Utility functions
function getScoreColor(score) {
    if (score >= 90) return 'text-teal-600';
    if (score >= 80) return 'text-sky-600';
    if (score >= 70) return 'text-amber-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
}

function getGradeBadgeClass(grade) {
    const classes = {
        'A': 'bg-teal-100 text-teal-700',
        'B': 'bg-sky-100 text-sky-700',
        'C': 'bg-amber-100 text-amber-700',
        'D': 'bg-orange-100 text-orange-700',
        'F': 'bg-red-100 text-red-700'
    };
    return classes[grade] || 'bg-gray-100 text-gray-700';
}

function getRiskBadgeClass(risk) {
    const classes = {
        'very-low': 'bg-teal-100 text-teal-700',
        'low': 'bg-green-100 text-green-700',
        'moderate': 'bg-amber-100 text-amber-700',
        'high': 'bg-orange-100 text-orange-700',
        'very-high': 'bg-red-100 text-red-700'
    };
    return classes[risk] || 'bg-gray-100 text-gray-700';
}

function translateRisk(risk) {
    const translations = {
        'very-low': 'Molto Basso',
        'low': 'Basso',
        'moderate': 'Moderato',
        'high': 'Alto',
        'very-high': 'Molto Alto'
    };
    return translations[risk] || risk;
}

// Modal handlers
function openDrivingDataModal(customerId, customerName) {
    document.getElementById('drivingDataModal').classList.remove('hidden');
    document.getElementById('drivingDataCustomerId').value = customerId;
    document.getElementById('drivingDataCustomerName').textContent = `Cliente: ${customerName}`;
    document.getElementById('drivingDataError').classList.add('hidden');
}

function closeDrivingDataModal() {
    document.getElementById('drivingDataModal').classList.add('hidden');
}

async function handleSubmitDrivingData(event) {
    event.preventDefault();

    const errorDiv = document.getElementById('drivingDataError');
    errorDiv.classList.add('hidden');

    const customerId = document.getElementById('drivingDataCustomerId').value;

    const now = new Date();
    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 3);

    const data = {
        analysisWindow: {
            startDate: startDate.toISOString(),
            endDate: now.toISOString(),
            totalDistanceKm: 5000,
            totalDrivingHours: 100
        },
        parameters: {
            harshBrakingEventsPerHundredKm: parseFloat(document.getElementById('dd_harsh_braking').value),
            harshAccelerationEventsPerHundredKm: parseFloat(document.getElementById('dd_harsh_acceleration').value),
            speedingViolationsPerHundredKm: parseFloat(document.getElementById('dd_speeding_violations').value),
            averageSpeedingMagnitudeKmh: parseFloat(document.getElementById('dd_speeding_magnitude').value),
            smoothAccelerationPercentage: parseFloat(document.getElementById('dd_smooth_acceleration').value),
            idlingTimePercentage: parseFloat(document.getElementById('dd_idling_time').value),
            optimalGearUsagePercentage: parseFloat(document.getElementById('dd_optimal_gear').value),
            fuelEfficiencyScore: parseFloat(document.getElementById('dd_fuel_efficiency').value),
            nightDrivingPercentage: parseFloat(document.getElementById('dd_night_driving').value),
            weekendDrivingPercentage: parseFloat(document.getElementById('dd_weekend_driving').value),
            phoneUsageEventsPerHundredKm: parseFloat(document.getElementById('dd_phone_usage').value),
            fatigueIndicatorsPerHundredKm: parseFloat(document.getElementById('dd_fatigue').value),
            totalMileageDriven: parseInt(document.getElementById('dd_total_mileage').value),
            yearsHoldingLicense: parseInt(document.getElementById('dd_years_license').value),
            routeVarietyScore: parseFloat(document.getElementById('dd_route_variety').value)
        }
    };

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/company/customers/${customerId}/driving-data`, {
            method: 'POST',
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Errore nel calcolo del profilo');
        }

        closeDrivingDataModal();
        await Promise.all([loadStatistics(), loadCustomers()]);

        // Show success message
        alert(`Profilo calcolato!\n\nScore: ${result.data.overallScore}\nGrado: ${result.data.overallGrade}\nRischio: ${translateRisk(result.data.riskLevel)}`);

    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    }
}

function openDeleteModal(customerId, customerName) {
    document.getElementById('deleteModal').classList.remove('hidden');
    document.getElementById('deleteCustomerId').value = customerId;
    document.getElementById('deleteCustomerName').textContent = customerName;
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
}

async function confirmDelete() {
    const customerId = document.getElementById('deleteCustomerId').value;

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/company/customers/${customerId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error?.message || 'Errore nell\'eliminazione');
        }

        closeDeleteModal();
        await Promise.all([loadStatistics(), loadCustomers()]);

    } catch (error) {
        alert('Errore: ' + error.message);
    }
}

function handleLogout() {
    localStorage.clear();
    window.location.href = '/login.html';
}
