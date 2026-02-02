// Customer Dashboard JavaScript

const API_BASE_URL = '/api/v1';

// State
let currentUser = null;
let currentProfile = null;
let currentSessionId = null;
let chatOpen = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

async function checkAuth() {
    const token = localStorage.getItem('drivewell_token');
    const userType = localStorage.getItem('drivewell_user_type');

    if (!token || userType !== 'customer') {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
        if (!response.ok) throw new Error('Unauthorized');

        const data = await response.json();
        currentUser = data.data.user;
        document.getElementById('userName').textContent = currentUser.fullName || currentUser.email;

        // Update sidebar info
        updateUserInfo();

        // Load profile
        await loadProfile();
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

function updateUserInfo() {
    document.getElementById('infoEmail').querySelector('span').textContent = currentUser.email;
    document.getElementById('infoPhone').querySelector('span').textContent = currentUser.phone || 'Non specificato';
    document.getElementById('infoLicense').querySelector('span').textContent =
        currentUser.driverLicenseYears ? `${currentUser.driverLicenseYears} anni` : 'Non specificato';
}

async function loadProfile() {
    const loadingDiv = document.getElementById('loading');
    const noProfileDiv = document.getElementById('noProfile');
    const resultsDiv = document.getElementById('results');

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/customer/profile`);
        const data = await response.json();

        loadingDiv.classList.add('hidden');

        if (data.success && data.data.hasProfile) {
            currentProfile = data.data.profile;
            noProfileDiv.classList.add('hidden');
            resultsDiv.classList.remove('hidden');
            displayResults(currentProfile);
        } else {
            noProfileDiv.classList.remove('hidden');
            resultsDiv.classList.add('hidden');
        }
    } catch (error) {
        console.error('Failed to load profile:', error);
        loadingDiv.innerHTML = `
            <div class="text-red-500 text-center">
                <i class="bi bi-exclamation-circle text-4xl mb-2"></i>
                <p>Errore nel caricamento del profilo</p>
            </div>
        `;
    }
}

function displayResults(profile) {
    // Update score ring
    const scoreAngle = (profile.overallScore / 100) * 360;
    const scoreColor = getScoreColor(profile.overallScore);
    const scoreRing = document.getElementById('scoreRing');
    scoreRing.style.setProperty('--score-angle', `${scoreAngle}deg`);
    scoreRing.style.background = `conic-gradient(from 0deg, ${scoreColor} 0deg, ${scoreColor} ${scoreAngle}deg, #e5e7eb ${scoreAngle}deg, #e5e7eb 360deg)`;

    document.getElementById('overallScore').textContent = Math.round(profile.overallScore);
    document.getElementById('gradeBadge').textContent = profile.overallGrade;
    document.getElementById('gradeBadge').className = `text-5xl font-bold ${getGradeTextColor(profile.overallGrade)}`;

    // Update sidebar summary
    document.getElementById('sidebarScore').textContent = Math.round(profile.overallScore);
    document.getElementById('sidebarGrade').textContent = profile.overallGrade;
    document.getElementById('sidebarRisk').textContent = translateRisk(profile.riskLevel);

    // Update risk badge
    const riskBadge = document.getElementById('riskBadge');
    riskBadge.textContent = translateRisk(profile.riskLevel);
    riskBadge.className = `text-2xl font-bold ${getRiskTextColor(profile.riskLevel)}`;

    // Update premium
    const premiumValue = document.getElementById('premiumValue');
    const premiumDetail = document.getElementById('premiumDetail');
    const modifier = profile.premiumModifier;

    if (modifier < 1) {
        const discount = Math.round((1 - modifier) * 100);
        premiumValue.textContent = `-${discount}%`;
        premiumValue.className = 'text-2xl font-bold text-green-600';
        premiumDetail.textContent = 'Sconto sul premio base';
    } else if (modifier > 1) {
        const increase = Math.round((modifier - 1) * 100);
        premiumValue.textContent = `+${increase}%`;
        premiumValue.className = 'text-2xl font-bold text-red-600';
        premiumDetail.textContent = 'Aumento sul premio base';
    } else {
        premiumValue.textContent = '0%';
        premiumValue.className = 'text-2xl font-bold text-gray-600';
        premiumDetail.textContent = 'Premio standard';
    }

    // Display competency areas
    displayCompetencyAreas(profile.competencyScores);

    // Display recommendations
    displayRecommendations(profile.recommendations);
}

function displayCompetencyAreas(competencyScores) {
    const grid = document.getElementById('competencyGrid');
    grid.innerHTML = '';

    const areaIcons = {
        'safety': 'shield-fill-check',
        'efficiency': 'lightning-fill',
        'behavior': 'person-check-fill',
        'experience': 'trophy-fill'
    };

    const areaColors = {
        'safety': 'red',
        'efficiency': 'green',
        'behavior': 'blue',
        'experience': 'amber'
    };

    const areaNames = {
        'safety': 'Sicurezza',
        'efficiency': 'Efficienza',
        'behavior': 'Comportamento',
        'experience': 'Esperienza'
    };

    competencyScores.forEach(area => {
        const icon = areaIcons[area.areaId] || 'circle';
        const color = areaColors[area.areaId] || 'gray';
        const name = areaNames[area.areaId] || area.areaId;

        const card = document.createElement('div');
        card.className = `p-4 rounded-lg bg-${color}-50 border-l-4 border-${color}-500 animate-fade-in`;
        card.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                    <i class="bi bi-${icon} text-${color}-600"></i>
                    <h3 class="font-semibold text-gray-800">${name}</h3>
                </div>
                <span class="text-lg font-bold ${getScoreTextColor(area.score)}">${Math.round(area.score)}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="h-2 rounded-full ${getScoreBarColor(area.score)}" style="width: ${area.score}%"></div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function displayRecommendations(recommendations) {
    const list = document.getElementById('recommendationsList');
    list.innerHTML = '';

    if (!recommendations || recommendations.length === 0) {
        list.innerHTML = `
            <div class="text-center text-gray-500 py-4">
                <i class="bi bi-check-circle text-2xl text-green-500 mb-2"></i>
                <p>Ottimo lavoro! Nessuna raccomandazione urgente.</p>
            </div>
        `;
        return;
    }

    const priorityIcons = {
        'CRITICAL': 'exclamation-triangle-fill',
        'HIGH': 'exclamation-circle-fill',
        'MEDIUM': 'info-circle-fill',
        'LOW': 'lightbulb-fill'
    };

    const priorityColors = {
        'CRITICAL': 'red',
        'HIGH': 'orange',
        'MEDIUM': 'amber',
        'LOW': 'blue'
    };

    recommendations.forEach(rec => {
        const icon = priorityIcons[rec.priority] || 'info-circle';
        const color = priorityColors[rec.priority] || 'gray';

        const card = document.createElement('div');
        card.className = `p-4 rounded-lg bg-${color}-50 border-l-4 border-${color}-500 animate-fade-in`;
        card.innerHTML = `
            <div class="flex items-start space-x-3">
                <i class="bi bi-${icon} text-${color}-600 text-xl mt-0.5"></i>
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800 mb-1">${rec.issue}</h4>
                    <p class="text-sm text-gray-600 mb-2">${rec.actionableAdvice}</p>
                    <div class="flex items-center space-x-4 text-xs text-gray-500">
                        <span class="flex items-center space-x-1">
                            <i class="bi bi-graph-up-arrow text-green-500"></i>
                            <span>+${rec.potentialImpact.scoreImprovement} punti</span>
                        </span>
                        <span class="flex items-center space-x-1">
                            <i class="bi bi-piggy-bank text-green-500"></i>
                            <span>-${rec.potentialImpact.premiumReduction}% premio</span>
                        </span>
                    </div>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

// Utility functions
function getScoreColor(score) {
    if (score >= 90) return '#0f766e';
    if (score >= 80) return '#0369a1';
    if (score >= 70) return '#d97706';
    if (score >= 60) return '#dc2626';
    return '#991b1b';
}

function getScoreTextColor(score) {
    if (score >= 90) return 'text-teal-600';
    if (score >= 80) return 'text-sky-600';
    if (score >= 70) return 'text-amber-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
}

function getScoreBarColor(score) {
    if (score >= 90) return 'bg-teal-500';
    if (score >= 80) return 'bg-sky-500';
    if (score >= 70) return 'bg-amber-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
}

function getGradeTextColor(grade) {
    const colors = {
        'A': 'text-teal-600',
        'B': 'text-sky-600',
        'C': 'text-amber-600',
        'D': 'text-orange-600',
        'F': 'text-red-600'
    };
    return colors[grade] || 'text-gray-600';
}

function getRiskTextColor(risk) {
    const colors = {
        'very-low': 'text-teal-600',
        'low': 'text-green-600',
        'moderate': 'text-amber-600',
        'high': 'text-orange-600',
        'very-high': 'text-red-600'
    };
    return colors[risk] || 'text-gray-600';
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

// Chat functions
function toggleChat() {
    const chatButton = document.getElementById('chatButton');
    const chatPanel = document.getElementById('chatPanel');

    chatOpen = !chatOpen;

    if (chatOpen) {
        chatButton.classList.add('hidden');
        chatPanel.classList.remove('hidden');
        chatPanel.classList.add('flex');
        document.getElementById('chatInput').focus();
    } else {
        chatButton.classList.remove('hidden');
        chatPanel.classList.add('hidden');
        chatPanel.classList.remove('flex');
    }
}

async function sendMessage(event) {
    event.preventDefault();

    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message to chat
    addMessageToChat(message, 'user');
    input.value = '';

    // Show typing indicator
    document.getElementById('typingIndicator').classList.remove('hidden');

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/customer/coach/chat`, {
            method: 'POST',
            body: JSON.stringify({
                message,
                sessionId: currentSessionId
            })
        });

        const data = await response.json();

        document.getElementById('typingIndicator').classList.add('hidden');

        if (data.success) {
            currentSessionId = data.data.sessionId;
            addMessageToChat(data.data.aiResponse, 'assistant');
        } else {
            addMessageToChat('Mi dispiace, si e verificato un errore. Riprova.', 'assistant');
        }
    } catch (error) {
        console.error('Chat error:', error);
        document.getElementById('typingIndicator').classList.add('hidden');
        addMessageToChat('Mi dispiace, si e verificato un errore di connessione.', 'assistant');
    }
}

function sendQuickMessage(message) {
    document.getElementById('chatInput').value = message;
    sendMessage(new Event('submit'));
}

function addMessageToChat(content, role) {
    const messagesContainer = document.getElementById('chatMessages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`;

    if (role === 'user') {
        messageDiv.innerHTML = `
            <div class="bg-slate-700 text-white rounded-lg px-4 py-3 max-w-[85%] shadow-sm">
                <p class="text-sm">${escapeHtml(content)}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="bg-white border border-gray-200 rounded-lg px-4 py-3 max-w-[85%] shadow-sm">
                <div class="flex items-start space-x-2">
                    <div class="bg-slate-100 rounded-full p-1.5 mt-0.5">
                        <i class="bi bi-car-front-fill text-slate-700 text-sm"></i>
                    </div>
                    <div class="text-sm text-gray-800">
                        ${formatMessage(content)}
                    </div>
                </div>
            </div>
        `;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatMessage(content) {
    // Basic markdown-like formatting
    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

function handleLogout() {
    localStorage.clear();
    window.location.href = '/login.html';
}
