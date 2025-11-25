// results.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '/login';
        return;
    }
    
    // Get assessment results (SELALU AMBIL DATA TERBARU)
    const results = JSON.parse(localStorage.getItem('currentAssessment'));
    if (!results) {
        window.location.href = '/assessment';
        return;
    }
    
    // Display results
    displayResults(results);
    
    // FITUR BARU: Auto-refresh setiap 2 detik untuk melihat perubahan compliance
    setInterval(() => {
        const updatedResults = JSON.parse(localStorage.getItem('currentAssessment'));
        if (updatedResults && updatedResults.totalScore !== results.totalScore) {
            displayResults(updatedResults);
            // Update reference
            Object.assign(results, updatedResults);
        }
    }, 2000);
});

function displayResults(results) {
    // Display total score
    const totalScoreElement = document.getElementById('totalScore');
    if (totalScoreElement) {
        totalScoreElement.textContent = results.totalScore.toFixed(1);
    }
    
    // Display trauma level with appropriate styling
    const traumaLevelElement = document.getElementById('traumaLevel');
    if (traumaLevelElement) {
        traumaLevelElement.textContent = results.traumaLevel;
        traumaLevelElement.className = 'level-badge ' + results.traumaLevel.toLowerCase();
    }
    
    // Update progress bar and marker
    const progressFill = document.getElementById('traumaProgress');
    const progressMarker = document.getElementById('traumaMarker');
    
    if (progressFill && progressMarker) {
        let progressWidth = 0;
        let markerPosition = 0;
        
        if (results.traumaLevel === 'Rendah') {
            progressWidth = '33%';
            markerPosition = 16.5;
        } else if (results.traumaLevel === 'Sedang') {
            progressWidth = '66%';
            markerPosition = 49.5;
        } else {
            progressWidth = '100%';
            markerPosition = 82.5;
        }
        
        progressFill.style.width = progressWidth;
        progressMarker.style.left = markerPosition + '%';
    }
    
    // Display trauma description
    const traumaDescElement = document.getElementById('traumaDescription');
    if (traumaDescElement) {
        traumaDescElement.textContent = getTraumaDescription(results.traumaLevel);
    }
    
    // Display recommendations
    const recommendationsContainer = document.getElementById('recommendations');
    if (recommendationsContainer && results.recommendations) {
        recommendationsContainer.innerHTML = '';
        
        results.recommendations.forEach(rec => {
            const recElement = document.createElement('div');
            recElement.className = 'recommendation-item';
            recElement.innerHTML = `
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
            `;
            recommendationsContainer.appendChild(recElement);
        });
    }
    
    // Display interventions
    const interventionsContainer = document.getElementById('interventions');
    if (interventionsContainer && results.interventions) {
        interventionsContainer.innerHTML = '';
        
        results.interventions.forEach(intervention => {
            const intElement = document.createElement('div');
            intElement.className = 'intervention-item';
            intElement.innerHTML = `
                <h4>${intervention.title}</h4>
                <p>${intervention.description}</p>
            `;
            interventionsContainer.appendChild(intElement);
        });
    }
    
    // Create progress chart
    const chartElement = document.getElementById('progressChart');
    if (chartElement) {
        createProgressChart(results);
    }
    
    // FITUR BARU: Tampilkan compliance info
    displayComplianceInfo();
}

function getTraumaDescription(level) {
    const descriptions = {
        'Rendah': 'Gejala trauma yang Anda alami berada dalam tingkat yang rendah. Ini menunjukkan kemampuan adaptasi yang baik terhadap stres. Tetap pertahankan gaya hidup sehat dan dukungan sosial.',
        'Sedang': 'Anda mengalami beberapa gejala trauma yang memerlukan perhatian. Disarankan untuk mencari dukungan profesional dan menerapkan teknik manajemen stres secara konsisten.',
        'Tinggi': 'Gejala trauma yang dialami memerlukan penanganan profesional segera. Sangat disarankan untuk berkonsultasi dengan ahli kesehatan mental untuk mendapatkan perawatan yang tepat.'
    };
    
    return descriptions[level] || '';
}

function createProgressChart(results) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    // Hapus chart lama jika ada
    if (window.traumaChart) {
        window.traumaChart.destroy();
    }
    
    // Get assessment history for this user
    const assessmentHistory = JSON.parse(localStorage.getItem('assessmentHistory')) || [];
    const userAssessments = assessmentHistory.filter(assessment => assessment.userId === results.userId);
    
    // Urutkan berdasarkan tanggal
    userAssessments.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const dates = userAssessments.map(assessment => {
        const date = new Date(assessment.date);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    });
    
    const scores = userAssessments.map(assessment => assessment.totalScore);
    
    window.traumaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Skor Trauma',
                data: scores,
                borderColor: '#20B2AA',
                backgroundColor: 'rgba(32, 178, 170, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Progress Assessment Trauma',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Skor: ' + context.parsed.y.toFixed(1);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 25,
                    title: {
                        display: true,
                        text: 'Skor'
                    },
                    ticks: {
                        stepSize: 5
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tanggal Assessment'
                    }
                }
            }
        }
    });
}

function goToTreatment() {
    window.location.href = 'treatment.html';
}

function saveResults() {
    // Simpan ke assessment history
    const results = JSON.parse(localStorage.getItem('currentAssessment'));
    if (!results) return;
    
    updateAssessmentHistory(results);
    alert('Hasil assessment telah disimpan. Anda dapat melihat riwayat assessment di dashboard.');
}

function updateAssessmentHistory(assessment) {
    let assessmentHistory = JSON.parse(localStorage.getItem('assessmentHistory')) || [];
    
    // Tambahkan entry baru
    assessmentHistory.push({
        userId: assessment.userId,
        totalScore: assessment.totalScore,
        traumaLevel: assessment.traumaLevel,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('assessmentHistory', JSON.stringify(assessmentHistory));
}

function printResults() {
    window.print();
}
