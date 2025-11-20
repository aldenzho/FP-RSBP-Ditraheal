// results.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '/login';
        return;
    }
    
    // Get assessment results
    const results = JSON.parse(localStorage.getItem('currentAssessment'));
    if (!results) {
        window.location.href = '/assessment';
        return;
    }
    
    // Display results
    displayResults(results);
});

function displayResults(results) {
    // Display total score
    document.getElementById('totalScore').textContent = results.totalScore;
    
    // Display trauma level with appropriate styling
    const traumaLevelElement = document.getElementById('traumaLevel');
    traumaLevelElement.textContent = results.traumaLevel;
    traumaLevelElement.className = 'level-badge ' + results.traumaLevel.toLowerCase();
    
    // Update progress bar and marker
    const progressFill = document.getElementById('traumaProgress');
    const progressMarker = document.getElementById('traumaMarker');
    
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
    
    // Display trauma description
    document.getElementById('traumaDescription').textContent = getTraumaDescription(results.traumaLevel);
    
    // Display recommendations
    const recommendationsContainer = document.getElementById('recommendations');
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
    
    // Display interventions
    const interventionsContainer = document.getElementById('interventions');
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
    
    // Create progress chart
    createProgressChart(results);
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
    
    // Get assessment history for this user
    const assessmentHistory = JSON.parse(localStorage.getItem('assessmentHistory')) || [];
    const userAssessments = assessmentHistory.filter(assessment => assessment.userId === results.userId);
    
    const dates = userAssessments.map(assessment => {
        const date = new Date(assessment.date);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    });
    
    const scores = userAssessments.map(assessment => assessment.totalScore);
    
    new Chart(ctx, {
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
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Progress Assessment Trauma'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 25,
                    title: {
                        display: true,
                        text: 'Skor'
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

function saveResults() {
    // In a real app, this would save to a database
    // For now, we'll just show a confirmation
    alert('Hasil assessment telah disimpan. Anda dapat melihat riwayat assessment di dashboard.');
}

function printResults() {
    window.print();
}