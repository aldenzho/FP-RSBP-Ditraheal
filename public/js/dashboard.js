// dashboard.js - Progress Tracking untuk Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user name
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = currentUser.firstName + ' ' + currentUser.lastName;
    }
    
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
        
        const progressButton = document.getElementById('progressButton');
        if (progressButton) {
            progressButton.style.display = 'none';
        }
        return;
    }
    
    // Hide empty state, show progress summary
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('progressSummary').style.display = 'block';
    document.getElementById('recentAssessments').style.display = 'block';
    
    const progressButton = document.getElementById('progressButton');
    if (progressButton) {
        progressButton.style.display = 'inline-block';
    }
    
    // Get latest assessment
    const latestAssessment = userAssessments[userAssessments.length - 1];
    
    // Update progress summary
    updateProgressSummary(latestAssessment, userAssessments);
    
    // Create progress chart with color coding
    createProgressChart(userAssessments);
    
    // Display recent assessments with color coding
    displayRecentAssessments(userAssessments);
}

function updateProgressSummary(latestAssessment, allAssessments) {
    // Update trauma level
    const traumaLevelElement = document.getElementById('currentTraumaLevel');
    if (traumaLevelElement) {
        traumaLevelElement.textContent = latestAssessment.traumaLevel;
        traumaLevelElement.className = 'trauma-level-badge ' + latestAssessment.traumaLevel.toLowerCase();
    }
    
    // Update trauma level description
    const descriptionElement = document.getElementById('traumaLevelDescription');
    if (descriptionElement) {
        descriptionElement.textContent = getTraumaLevelDescription(latestAssessment.traumaLevel);
    }
    
    // Update score
    const currentScoreElement = document.getElementById('currentScore');
    if (currentScoreElement) {
        currentScoreElement.textContent = latestAssessment.totalScore.toFixed(0);
    }
    
    const lastScoreElement = document.getElementById('lastScore');
    if (lastScoreElement) {
        lastScoreElement.textContent = latestAssessment.totalScore.toFixed(0);
    }
    
    // Update assessment date
    const lastDate = new Date(latestAssessment.date);
    const lastAssessmentDateElement = document.getElementById('lastAssessmentDate');
    if (lastAssessmentDateElement) {
        lastAssessmentDateElement.textContent = lastDate.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
    
    // Update total assessments
    const totalAssessmentsElement = document.getElementById('totalAssessments');
    if (totalAssessmentsElement) {
        totalAssessmentsElement.textContent = allAssessments.length;
    }
}

function getTraumaLevelDescription(level) {
    const descriptions = {
        'Rendah': 'Gejala trauma dalam tingkat rendah. Pertahankan gaya hidup sehat.',
        'Ringan': 'Beberapa gejala trauma terdeteksi, namun masih dapat dikelola.',
        'Sedang': 'Beberapa gejala trauma terdeteksi. Perlu perhatian dan dukungan.',
        'Tinggi': 'Gejala trauma signifikan. Disarankan konsultasi profesional.'
    };
    
    return descriptions[level] || 'Data tidak tersedia';
}

// FUNGSI BARU: Get Color berdasarkan Level Trauma
function getColorByLevel(level) {
    const colors = {
        'Rendah': '#058c09',   // Hijau tua
        'Ringan': '#09ec11',   // Hijau muda
        'Sedang': '#FF9800',   // Orange
        'Tinggi': '#F44336'    // Merah
    };
    return colors[level] || '#20B2AA'; // Default teal
}

// FUNGSI BARU: Get Color berdasarkan Score IES-R
function getColorByScore(score) {
    // IES-R cut-off points:
    // 0-23 = Rendah (Hijau tua)
    // 24-32 = Ringan (Hijau muda)
    // 33-36 = Sedang (Orange)
    // 37-88 = Tinggi (Merah)
    
    if (score <= 23) {
        return '#058c09'; // Rendah - Hijau tua
    } else if (score <= 32) {
        return '#09ec11'; // Ringan - Hijau muda
    } else if (score <= 36) {
        return '#FF9800'; // Sedang - Orange
    } else {
        return '#F44336'; // Tinggi - Merah
    }
}

function createProgressChart(assessments) {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    const context = ctx.getContext('2d');
    
    // Destroy existing chart if any
    if (window.dashboardChart) {
        window.dashboardChart.destroy();
    }
    
    // Sort assessments by date
    assessments.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const dates = assessments.map(assessment => {
        const date = new Date(assessment.date);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    });
    
    const scores = assessments.map(assessment => assessment.totalScore);
    
    // FITUR BARU: Warna point berdasarkan level trauma masing-masing
    const pointColors = assessments.map(assessment => getColorByLevel(assessment.traumaLevel));
    
    // Determine line color based on latest assessment
    const latestLevel = assessments[assessments.length - 1].traumaLevel;
    const lineColor = getColorByLevel(latestLevel);
    
    // Create gradient for background
    const gradient = context.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, lineColor + '40'); // 40 = 25% opacity
    gradient.addColorStop(1, lineColor + '00'); // 00 = 0% opacity
    
    window.dashboardChart = new Chart(context, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Skor IES-R',
                data: scores,
                borderColor: lineColor,
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: pointColors, // WARNA BERBEDA PER POINT
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 7,
                pointHoverRadius: 9,
                pointHoverBorderWidth: 3
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
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const score = context.raw;
                            const assessment = assessments[context.dataIndex];
                            const level = assessment.traumaLevel;
                            return `Skor: ${score.toFixed(0)} (${level})`;
                        },
                        labelColor: function(context) {
                            const assessment = assessments[context.dataIndex];
                            const color = getColorByLevel(assessment.traumaLevel);
                            return {
                                borderColor: color,
                                backgroundColor: color,
                                borderWidth: 2,
                                borderRadius: 2
                            };
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
                        text: 'Skor IES-R (0-88)',
                        font: {
                            weight: 'bold',
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.08)'
                    },
                    ticks: {
                        stepSize: 10
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tanggal Assessment',
                        font: {
                            weight: 'bold',
                            size: 12
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

function displayRecentAssessments(assessments) {
    const container = document.getElementById('assessmentsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Show only last 5 assessments
    const recentAssessments = assessments.slice(-5).reverse();
    
    recentAssessments.forEach(assessment => {
        const date = new Date(assessment.date);
        const assessmentElement = document.createElement('div');
        assessmentElement.className = 'assessment-item';
        
        // Get color based on trauma level
        const levelColor = getColorByLevel(assessment.traumaLevel);
        
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
                <span class="assessment-score">Skor: ${assessment.totalScore.toFixed(0)}/88</span>
                <span class="assessment-level" style="background-color: ${levelColor}; color: white; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 13px;">
                    ${assessment.traumaLevel}
                </span>
            </div>
        `;
        
        // Tambahkan border kiri dengan warna sesuai level
        assessmentElement.style.borderLeft = `4px solid ${levelColor}`;
        
        container.appendChild(assessmentElement);
    });
}

function logout() {
    // Konfirmasi logout
    const confirmed = confirm('Apakah Anda yakin ingin keluar?');
    if (confirmed) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }
}