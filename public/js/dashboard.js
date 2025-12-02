// dashboard.js - Progress Tracking untuk Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '/login';
        return;
    }
    
    // Display user name
    document.getElementById('userName').textContent = currentUser.firstName + ' ' + currentUser.lastName;
    
    // Load and display progress data
    loadProgressData();
});

function loadProgressData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const assessmentHistory = JSON.parse(localStorage.getItem('assessmentHistory')) || [];
    
    // Filter assessments for current user
    const userAssessments = assessmentHistory.filter(assessment => assessment.userId === currentUser.id);
    
    if (userAssessments.length === 0) {
        // Show empty state
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('progressSummary').style.display = 'none';
        document.getElementById('recentAssessments').style.display = 'none';
        document.getElementById('progressButton').style.display = 'none';
        return;
    }
    
    // Hide empty state, show progress summary
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('progressSummary').style.display = 'block';
    document.getElementById('recentAssessments').style.display = 'block';
    document.getElementById('progressButton').style.display = 'inline-block';
    
    // Get latest assessment
    const latestAssessment = userAssessments[userAssessments.length - 1];
    
    // Update progress summary
    updateProgressSummary(latestAssessment, userAssessments);
    
    // Create progress chart
    createProgressChart(userAssessments);
    
    // Display recent assessments
    displayRecentAssessments(userAssessments);
}

function updateProgressSummary(latestAssessment, allAssessments) {
    // Update trauma level
    const traumaLevelElement = document.getElementById('currentTraumaLevel');
    traumaLevelElement.textContent = latestAssessment.traumaLevel;
    traumaLevelElement.className = 'trauma-level-badge ' + latestAssessment.traumaLevel.toLowerCase();
    
    // Update trauma level description
    const descriptionElement = document.getElementById('traumaLevelDescription');
    descriptionElement.textContent = getTraumaLevelDescription(latestAssessment.traumaLevel);
    
    // Update score
    document.getElementById('currentScore').textContent = latestAssessment.totalScore;
    document.getElementById('lastScore').textContent = latestAssessment.totalScore;
    
    // Update assessment date
    const lastDate = new Date(latestAssessment.date);
    document.getElementById('lastAssessmentDate').textContent = lastDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Update total assessments
    document.getElementById('totalAssessments').textContent = allAssessments.length;
}

function getTraumaLevelDescription(level) {
    const descriptions = {
        'Rendah': 'Gejala trauma dalam tingkat rendah. Pertahankan gaya hidup sehat.',
        'Ringan': 'Beberapa gejala trauma terdeteksi, namun masih dapat dikelola. Pertahankan strategi koping yang baik.',
        'Sedang': 'Beberapa gejala trauma terdeteksi. Perlu perhatian dan dukungan.',
        'Tinggi': 'Gejala trauma signifikan. Disarankan konsultasi profesional.'
    };
    
    return descriptions[level] || 'Data tidak tersedia';
}

function createProgressChart(assessments) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    // Sort assessments by date
    assessments.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const dates = assessments.map(assessment => {
        const date = new Date(assessment.date);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    });
    
    const scores = assessments.map(assessment => assessment.totalScore);
    
    // Determine line color based on trend
    const lineColor = getTrendColor(scores);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Skor Trauma',
                data: scores,
                borderColor: lineColor,
                backgroundColor: 'rgba(32, 178, 170, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#20B2AA',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Perkembangan Skor Trauma',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#333'
                },
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            const score = context.raw;
                            let level = '';
                            if (score <= 10) level = '(Rendah)';
                            else if (score <= 15) level = '(Sedang)';
                            else level = '(Tinggi)';
                            return `Skor: ${score} ${level}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Skor Trauma',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tanggal Assessment',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function getTrendColor(scores) {
    if (scores.length < 2) return '#20B2AA'; // Default color
    
    const firstScore = scores[0];
    const lastScore = scores[scores.length - 1];
    
    if (lastScore < firstScore) {
        return '#4CAF50'; // Green - improving
    } else if (lastScore > firstScore) {
        return '#F44336'; // Red - worsening
    } else {
        return '#FF9800'; // Orange - stable
    }
}

function displayRecentAssessments(assessments) {
    const container = document.getElementById('assessmentsList');
    container.innerHTML = '';
    
    // Show only last 3 assessments
    const recentAssessments = assessments.slice(-3).reverse();
    
    recentAssessments.forEach(assessment => {
        const date = new Date(assessment.date);
        const assessmentElement = document.createElement('div');
        assessmentElement.className = 'assessment-item';
        
        assessmentElement.innerHTML = `
            <div class="assessment-date">
                ${date.toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </div>
            <div class="assessment-details">
                <span class="assessment-score">Skor: ${assessment.totalScore}/88</span>
                <span class="assessment-level ${assessment.traumaLevel.toLowerCase()}">${assessment.traumaLevel}</span>
            </div>
        `;
        
        container.appendChild(assessmentElement);
    });
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    window.location.href = '/';
}