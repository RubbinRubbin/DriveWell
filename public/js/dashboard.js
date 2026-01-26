// API Base URL
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Profili predefiniti
const profiles = {
    excellent: {
        driverId: "DR-TEST-EXCELLENT",
        analysisWindow: {
            startDate: "2024-10-01T00:00:00Z",
            endDate: "2025-01-01T00:00:00Z",
            totalDistanceKm: 5000,
            totalDrivingHours: 120
        },
        parameters: {
            harshBrakingEventsPerHundredKm: 0.3,
            harshAccelerationEventsPerHundredKm: 0.8,
            speedingViolationsPerHundredKm: 0.1,
            averageSpeedingMagnitudeKmh: 2.5,
            smoothAccelerationPercentage: 92,
            idlingTimePercentage: 4,
            optimalGearUsagePercentage: 88,
            fuelEfficiencyScore: 87,
            nightDrivingPercentage: 8,
            weekendDrivingPercentage: 28,
            phoneUsageEventsPerHundredKm: 0.05,
            fatigueIndicatorsPerHundredKm: 0.1,
            totalMileageDriven: 120000,
            yearsHoldingLicense: 12,
            routeVarietyScore: 75
        }
    },
    moderate: {
        driverId: "DR-TEST-MODERATE",
        analysisWindow: {
            startDate: "2024-10-01T00:00:00Z",
            endDate: "2025-01-01T00:00:00Z",
            totalDistanceKm: 4200,
            totalDrivingHours: 105
        },
        parameters: {
            harshBrakingEventsPerHundredKm: 2.1,
            harshAccelerationEventsPerHundredKm: 3.2,
            speedingViolationsPerHundredKm: 1.8,
            averageSpeedingMagnitudeKmh: 10,
            smoothAccelerationPercentage: 75,
            idlingTimePercentage: 9,
            optimalGearUsagePercentage: 72,
            fuelEfficiencyScore: 65,
            nightDrivingPercentage: 18,
            weekendDrivingPercentage: 35,
            phoneUsageEventsPerHundredKm: 0.8,
            fatigueIndicatorsPerHundredKm: 1.0,
            totalMileageDriven: 45000,
            yearsHoldingLicense: 6,
            routeVarietyScore: 55
        }
    },
    highRisk: {
        driverId: "DR-TEST-HIGHRISK",
        analysisWindow: {
            startDate: "2024-10-01T00:00:00Z",
            endDate: "2025-01-01T00:00:00Z",
            totalDistanceKm: 3200,
            totalDrivingHours: 85
        },
        parameters: {
            harshBrakingEventsPerHundredKm: 6.2,
            harshAccelerationEventsPerHundredKm: 7.5,
            speedingViolationsPerHundredKm: 8.3,
            averageSpeedingMagnitudeKmh: 28,
            smoothAccelerationPercentage: 58,
            idlingTimePercentage: 22,
            optimalGearUsagePercentage: 52,
            fuelEfficiencyScore: 38,
            nightDrivingPercentage: 42,
            weekendDrivingPercentage: 65,
            phoneUsageEventsPerHundredKm: 3.5,
            fatigueIndicatorsPerHundredKm: 3.2,
            totalMileageDriven: 18000,
            yearsHoldingLicense: 2,
            routeVarietyScore: 25
        }
    }
};

// Carica profilo eccellente
function loadExcellentDriver() {
    assessDriver(profiles.excellent);
}

// Carica profilo moderato
function loadModerateDriver() {
    assessDriver(profiles.moderate);
}

// Carica profilo alto rischio
function loadHighRiskDriver() {
    assessDriver(profiles.highRisk);
}

// Toggle form personalizzato
function toggleCustomForm() {
    const form = document.getElementById('customForm');
    const welcome = document.getElementById('welcomeMessage');
    const results = document.getElementById('results');

    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        welcome.classList.add('hidden');
        results.classList.add('hidden');
        form.classList.add('animate-fade-in');
    } else {
        form.classList.add('hidden');
        welcome.classList.remove('hidden');
        welcome.classList.add('animate-fade-in');
    }
}

// Submit dati personalizzati
function submitCustomData() {
    const drivingData = {
        driverId: "DR-CUSTOM-" + Date.now(),
        analysisWindow: {
            startDate: "2024-10-01T00:00:00Z",
            endDate: "2025-01-01T00:00:00Z",
            totalDistanceKm: 5000,
            totalDrivingHours: 120
        },
        parameters: {
            harshBrakingEventsPerHundredKm: parseFloat(document.getElementById('harsh_braking').value),
            harshAccelerationEventsPerHundredKm: parseFloat(document.getElementById('harsh_acceleration').value),
            speedingViolationsPerHundredKm: parseFloat(document.getElementById('speeding_violations').value),
            averageSpeedingMagnitudeKmh: parseFloat(document.getElementById('speeding_magnitude').value),
            smoothAccelerationPercentage: parseFloat(document.getElementById('smooth_acceleration').value),
            idlingTimePercentage: parseFloat(document.getElementById('idling_time').value),
            optimalGearUsagePercentage: parseFloat(document.getElementById('optimal_gear').value),
            fuelEfficiencyScore: parseFloat(document.getElementById('fuel_efficiency').value),
            nightDrivingPercentage: parseFloat(document.getElementById('night_driving').value),
            weekendDrivingPercentage: parseFloat(document.getElementById('weekend_driving').value),
            phoneUsageEventsPerHundredKm: parseFloat(document.getElementById('phone_usage').value),
            fatigueIndicatorsPerHundredKm: parseFloat(document.getElementById('fatigue').value),
            totalMileageDriven: parseFloat(document.getElementById('total_mileage').value),
            yearsHoldingLicense: parseFloat(document.getElementById('years_license').value),
            routeVarietyScore: parseFloat(document.getElementById('route_variety').value)
        }
    };

    assessDriver(drivingData);
}

// Valuta driver
async function assessDriver(drivingData) {
    // Mostra loading
    document.getElementById('welcomeMessage').classList.add('hidden');
    document.getElementById('customForm').classList.add('hidden');
    document.getElementById('results').classList.add('hidden');
    document.getElementById('loading').classList.remove('hidden');

    try {
        const response = await fetch(`${API_BASE_URL}/assessments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(drivingData)
        });

        if (!response.ok) {
            throw new Error('Errore nella valutazione');
        }

        const result = await response.json();

        // Delay per mostrare il loading
        await new Promise(resolve => setTimeout(resolve, 800));

        displayResults(result.data);
    } catch (error) {
        console.error('Errore:', error);
        alert('Errore durante la valutazione. Assicurati che il server sia avviato.');
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('welcomeMessage').classList.remove('hidden');
    }
}

// Mostra risultati
function displayResults(profile) {
    document.getElementById('loading').classList.add('hidden');
    const resultsContainer = document.getElementById('results');
    resultsContainer.classList.remove('hidden');
    resultsContainer.classList.add('animate-fade-in');

    // Anima Overall Score con circular progress
    animateScore(profile.overallScore);

    // Grade Badge
    const gradeBadge = document.getElementById('gradeBadge');
    gradeBadge.textContent = profile.overallGrade;
    gradeBadge.className = `text-5xl font-bold ${getGradeColor(profile.overallGrade)}`;

    // Risk Level
    const riskBadge = document.getElementById('riskBadge');
    riskBadge.textContent = formatRiskLevel(profile.riskLevel);
    riskBadge.className = `text-2xl font-bold ${getRiskColor(profile.riskLevel)}`;

    // Premium Modifier
    const premiumChange = ((profile.premiumModifier - 1) * 100).toFixed(0);
    const premiumSign = premiumChange >= 0 ? '+' : '';
    const premiumValue = document.getElementById('premiumValue');
    premiumValue.textContent = `${premiumSign}${premiumChange}%`;
    premiumValue.className = `text-2xl font-bold ${premiumChange < 0 ? 'text-green-600' : 'text-red-600'}`;
    document.getElementById('premiumDetail').textContent = `Moltiplicatore: ${profile.premiumModifier.toFixed(2)}`;

    // Competency Areas
    displayCompetencyAreas(profile.competencyScores);

    // Recommendations
    displayRecommendations(profile.recommendations);
}

// Anima score circolare
function animateScore(targetScore) {
    const scoreElement = document.getElementById('overallScore');
    const scoreRing = document.getElementById('scoreRing');

    let currentScore = 0;
    const duration = 1500; // 1.5 secondi
    const steps = 60;
    const increment = targetScore / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(timer);
        }

        scoreElement.textContent = currentScore.toFixed(1);

        // Aggiorna il cerchio colorato
        const angle = (currentScore / 100) * 360;
        const color = getScoreColor(currentScore);
        scoreRing.style.background = `conic-gradient(from 0deg, ${color} 0deg, ${color} ${angle}deg, #e5e7eb ${angle}deg, #e5e7eb 360deg)`;
    }, interval);
}

// Ottieni colore basato su score
function getScoreColor(score) {
    if (score >= 90) return '#0f766e'; // teal
    if (score >= 80) return '#0369a1'; // sky blue
    if (score >= 70) return '#d97706'; // amber
    if (score >= 60) return '#dc2626'; // red
    return '#991b1b'; // dark red
}

// Ottieni colore grade
function getGradeColor(grade) {
    const colors = {
        'A': 'text-teal-700',
        'B': 'text-sky-700',
        'C': 'text-amber-700',
        'D': 'text-red-700',
        'F': 'text-red-900'
    };
    return colors[grade] || 'text-gray-700';
}

// Ottieni colore risk
function getRiskColor(level) {
    const colors = {
        'very-low': 'text-teal-700',
        'low': 'text-sky-700',
        'moderate': 'text-amber-700',
        'high': 'text-red-700',
        'very-high': 'text-red-900'
    };
    return colors[level] || 'text-gray-700';
}

// Mostra aree di competenza
function displayCompetencyAreas(areas) {
    const grid = document.getElementById('competencyGrid');
    grid.innerHTML = '';

    const areaConfig = {
        safety: {
            name: 'Sicurezza',
            icon: 'bi-shield-fill-check',
            color: 'red'
        },
        efficiency: {
            name: 'Efficienza',
            icon: 'bi-lightning-fill',
            color: 'green'
        },
        behavior: {
            name: 'Comportamento',
            icon: 'bi-person-check-fill',
            color: 'blue'
        },
        experience: {
            name: 'Esperienza',
            icon: 'bi-trophy-fill',
            color: 'amber'
        }
    };

    areas.forEach(area => {
        const config = areaConfig[area.areaId];
        const card = document.createElement('div');
        card.className = `border-l-4 border-${config.color}-500 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow`;

        let parametersHTML = '';
        area.parameterScores.forEach(param => {
            parametersHTML += `
                <div class="flex justify-between items-center text-sm py-1">
                    <span class="text-gray-600">${formatParameterId(param.parameterId)}</span>
                    <span class="font-semibold text-gray-900">${param.normalizedScore.toFixed(1)}</span>
                </div>
            `;
        });

        card.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                    <i class="bi ${config.icon} text-${config.color}-600 text-lg"></i>
                    <h3 class="font-semibold text-gray-900">${config.name}</h3>
                </div>
                <span class="text-2xl font-bold ${getGradeColor(area.grade)}">${area.grade}</span>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-3">${area.score.toFixed(1)}</div>
            <div class="space-y-1 border-t border-gray-200 pt-3">
                ${parametersHTML}
            </div>
        `;

        grid.appendChild(card);
    });
}

// Mostra raccomandazioni
function displayRecommendations(recommendations) {
    const list = document.getElementById('recommendationsList');

    if (recommendations.length === 0) {
        list.innerHTML = `
            <div class="text-center py-8">
                <i class="bi bi-check-circle-fill text-5xl text-green-500 mb-3"></i>
                <p class="text-lg font-semibold text-gray-900">Performance Eccellente!</p>
                <p class="text-gray-600">Nessuna raccomandazione - continua così!</p>
            </div>
        `;
        return;
    }

    list.innerHTML = '';
    recommendations.forEach((rec, index) => {
        const card = document.createElement('div');
        const priorityConfig = {
            critical: { bg: 'bg-red-50', border: 'border-red-500', badge: 'bg-red-600', icon: 'bi-exclamation-circle-fill' },
            high: { bg: 'bg-orange-50', border: 'border-orange-500', badge: 'bg-orange-600', icon: 'bi-exclamation-triangle-fill' },
            medium: { bg: 'bg-amber-50', border: 'border-amber-500', badge: 'bg-amber-600', icon: 'bi-info-circle-fill' },
            low: { bg: 'bg-blue-50', border: 'border-blue-500', badge: 'bg-blue-600', icon: 'bi-lightbulb-fill' }
        };

        const config = priorityConfig[rec.priority];
        card.className = `${config.bg} border-l-4 ${config.border} rounded-lg p-4 hover:shadow-md transition-all`;
        card.style.animationDelay = `${index * 100}ms`;
        card.classList.add('animate-fade-in');

        card.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                    <i class="bi ${config.icon} text-${rec.priority === 'critical' ? 'red' : rec.priority === 'high' ? 'orange' : rec.priority === 'medium' ? 'amber' : 'blue'}-600"></i>
                    <span class="inline-block px-3 py-1 ${config.badge} text-white text-xs font-semibold rounded-full uppercase">
                        ${rec.priority}
                    </span>
                </div>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">${rec.issue}</h4>
            <p class="text-sm text-gray-700 mb-3">${rec.actionableAdvice}</p>
            <div class="flex items-center space-x-4 text-xs text-gray-600">
                <div class="flex items-center space-x-1">
                    <i class="bi bi-graph-up-arrow text-green-600"></i>
                    <span class="font-medium">Score: +${rec.potentialImpact.scoreImprovement}</span>
                </div>
                <div class="flex items-center space-x-1">
                    <i class="bi bi-piggy-bank text-green-600"></i>
                    <span class="font-medium">Premium: -${rec.potentialImpact.premiumReduction}%</span>
                </div>
            </div>
        `;

        list.appendChild(card);
    });
}

// Formatta risk level
function formatRiskLevel(level) {
    const levels = {
        'very-low': 'Molto Basso',
        'low': 'Basso',
        'moderate': 'Moderato',
        'high': 'Alto',
        'very-high': 'Molto Alto'
    };
    return levels[level] || level;
}

// Formatta parameter ID
function formatParameterId(id) {
    const names = {
        harsh_braking: 'Frenate Brusche',
        harsh_acceleration: 'Accel. Brusche',
        speeding_violations: 'Eccessi Velocità',
        speeding_magnitude: 'Entità Eccesso',
        smooth_acceleration: 'Accel. Fluida',
        idling_time: 'Tempo al Minimo',
        optimal_gear_usage: 'Uso Marce',
        fuel_efficiency: 'Eff. Carburante',
        night_driving: 'Guida Notturna',
        weekend_driving: 'Guida Weekend',
        phone_usage: 'Uso Telefono',
        fatigue_indicators: 'Affaticamento',
        total_mileage: 'Chilometraggio',
        years_license: 'Esperienza',
        route_variety: 'Varietà Percorsi'
    };
    return names[id] || id;
}

// ========================================
// AI COACH CHAT FUNCTIONALITY
// ========================================

// Chat state
let currentSessionId = null;
let currentDriverId = null;
let lastDrivingData = null;

// Toggle chat panel
function toggleChat() {
    const panel = document.getElementById('chatPanel');
    const button = document.getElementById('chatButton');

    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        panel.classList.add('flex');
        button.classList.add('hidden');
        loadChatHistory();
    } else {
        panel.classList.add('hidden');
        panel.classList.remove('flex');
        button.classList.remove('hidden');
    }
}

// Load chat history
async function loadChatHistory() {
    if (!currentDriverId) {
        console.log('No driver ID set yet');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/coach/sessions/${currentDriverId}/active`);
        const result = await response.json();

        if (result.success && result.data.messages.length > 0) {
            currentSessionId = result.data.sessionId;
            // Clear chat except welcome message
            const chatMessages = document.getElementById('chatMessages');
            const welcomeMessage = chatMessages.querySelector('.flex.justify-start');
            chatMessages.innerHTML = '';
            if (welcomeMessage) {
                chatMessages.appendChild(welcomeMessage);
            }
            // Render history
            result.data.messages.forEach(msg => {
                appendChatMessage(msg.role, msg.content, false);
            });
        }
    } catch (error) {
        console.error('Failed to load chat history:', error);
    }
}

// Send message
async function sendMessage(event) {
    event.preventDefault();

    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // For testing without driver data, use a default ID
    if (!currentDriverId) {
        currentDriverId = 'test-driver-001';
    }

    // Clear input
    input.value = '';

    // Show user message
    appendChatMessage('user', message);

    // Show typing indicator
    document.getElementById('typingIndicator').classList.remove('hidden');

    try {
        const requestBody = {
            driverId: currentDriverId,
            message: message,
            sessionId: currentSessionId
        };

        // Include driving data if available
        if (lastDrivingData) {
            requestBody.drivingData = lastDrivingData;
        }

        const response = await fetch(`${API_BASE_URL}/coach/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (result.success) {
            currentSessionId = result.data.sessionId;
            appendChatMessage('assistant', result.data.response);
        } else {
            appendChatMessage('assistant', 'Mi dispiace, ho riscontrato un errore. Riprova per favore.');
        }
    } catch (error) {
        console.error('Chat error:', error);
        appendChatMessage('assistant', 'Mi dispiace, sto avendo problemi di connessione. Verifica che il server sia avviato e che la chiave API di OpenAI sia configurata.');
    } finally {
        document.getElementById('typingIndicator').classList.add('hidden');
    }
}

// Quick message
function sendQuickMessage(message) {
    document.getElementById('chatInput').value = message;
    sendMessage(new Event('submit'));
}

// Append chat message
function appendChatMessage(role, content, animate = true) {
    const container = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');

    if (role === 'user') {
        messageDiv.className = `flex justify-end ${animate ? 'animate-fade-in' : ''}`;
        messageDiv.innerHTML = `
            <div class="bg-slate-700 text-white rounded-lg px-4 py-3 max-w-[85%] shadow-sm">
                <p class="text-sm">${escapeHtml(content)}</p>
            </div>
        `;
    } else {
        messageDiv.className = `flex justify-start ${animate ? 'animate-fade-in' : ''}`;
        messageDiv.innerHTML = `
            <div class="bg-white border border-gray-200 rounded-lg px-4 py-3 max-w-[85%] shadow-sm">
                <div class="flex items-start space-x-2">
                    <div class="bg-slate-100 rounded-full p-1.5 mt-0.5 flex-shrink-0">
                        <i class="bi bi-car-front-fill text-slate-700 text-sm"></i>
                    </div>
                    <div class="text-sm text-gray-800">${formatMarkdown(content)}</div>
                </div>
            </div>
        `;
    }

    container.appendChild(messageDiv);
    scrollChatToBottom();
}

// Format markdown (simple version - handles **bold** and bullet points)
function formatMarkdown(text) {
    // Escape HTML first
    let formatted = escapeHtml(text);

    // Bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');

    // Bullet points
    formatted = formatted.replace(/^- (.*?)(<br>|$)/gm, '• $1$2');

    return formatted;
}

// Scroll chat to bottom
function scrollChatToBottom() {
    const container = document.getElementById('chatMessages');
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 100);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update assessDriver function to set currentDriverId and save last driving data
const originalAssessDriver = assessDriver;
assessDriver = function(drivingData) {
    currentDriverId = drivingData.driverId;
    lastDrivingData = drivingData;
    return originalAssessDriver(drivingData);
};

// Add CSS animation for fade-in
const style = document.createElement('style');
style.textContent = `
    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-fade-in {
        animation: fade-in 0.3s ease-out;
    }
`;
document.head.appendChild(style);
