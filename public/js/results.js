// results.js
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Get assessment results from user profile
    const results = currentUser.latestAssessment;
    if (!results) {
        window.location.href = 'assessment.html';
        return;
    }

    // Display results
    displayResults(results);

    // FITUR AUTO-REFRESH: Update setiap 2 detik untuk melihat perubahan compliance
    let lastScore = results.totalScore;
    setInterval(() => {
        const updatedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (updatedUser && updatedUser.latestAssessment && updatedUser.latestAssessment.totalScore !== lastScore) {
            console.log('Score updated! Refreshing display...');
            displayResults(updatedUser.latestAssessment);
            lastScore = updatedUser.latestAssessment.totalScore;
            
            // Tampilkan notifikasi visual
            showUpdateNotification();
        }
    }, 2000);

    // Tambahkan event listener untuk tombol
    const treatmentBtn = document.getElementById('treatmentBtn');
    if (treatmentBtn) {
        treatmentBtn.addEventListener('click', goToTreatment);
    }
});

function displayResults(results) {
    // Display total score (IES-R 0-88)
    const totalScoreElement = document.getElementById('totalScore');
    if (totalScoreElement) {
        totalScoreElement.textContent = results.totalScore.toFixed(0);
        
        // Animasi saat score berubah
        totalScoreElement.style.animation = 'none';
        setTimeout(() => {
            totalScoreElement.style.animation = 'scoreUpdate 0.5s ease';
        }, 10);
    }

    // Display trauma level with appropriate styling
    const traumaLevelElement = document.getElementById('traumaLevel');
    if (traumaLevelElement) {
        traumaLevelElement.textContent = results.traumaLevel;
        traumaLevelElement.className = 'level-badge ' + results.traumaLevel.toLowerCase().replace(/\s+/g, '-');
    }

    // Update progress bar and marker berdasarkan IES-R
    const progressFill = document.getElementById('traumaProgress');
    const progressMarker = document.getElementById('traumaMarker');

    if (progressFill && progressMarker) {
        // Tentukan posisi marker berdasarkan skor aktual (0-100%)
        const markerPosition = Math.min((results.totalScore / 88) * 100, 100);
        let progressWidth = markerPosition;

        progressFill.style.width = progressWidth + '%';
        progressMarker.style.left = markerPosition + '%';
    }

    // Display trauma description
    const traumaDescElement = document.getElementById('traumaDescription');
    if (traumaDescElement) {
        traumaDescElement.textContent = results.traumaDescription;
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
    
    // FITUR BARU: Tampilkan compliance info dengan 1 POIN per tugas
    displayComplianceInfo(results);
    
    // FITUR BARU: Tampilkan achievement jika ada kemajuan signifikan
    checkAndDisplayAchievement(results);
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
        return date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    });

    const scores = userAssessments.map(assessment => assessment.totalScore);

    window.traumaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Skor IES-R',
                data: scores,
                borderColor: '#20B2AA',
                backgroundColor: 'rgba(32, 178, 170, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#20B2AA',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Progress Skor IES-R',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return 'Skor IES-R: ' + context.parsed.y.toFixed(0);
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
                        text: 'Skor IES-R (0-88)'
                    },
                    ticks: {
                        stepSize: 10
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tanggal Assessment'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// FUNGSI BARU: Tampilkan Info Compliance (1 POIN PER TUGAS)
function displayComplianceInfo(results) {
    const dailyProgress = JSON.parse(localStorage.getItem('dailyTaskProgress')) || [];
    const completedTasks = dailyProgress.length;
    const scoreImprovement = completedTasks * 1; // 1 POIN PER TUGAS
    
    // Cari atau buat container untuk info compliance
    let complianceInfo = document.getElementById('compliance-info');
    
    if (completedTasks > 0) {
        if (!complianceInfo) {
            // Buat element baru jika belum ada
            const resultsContainer = document.querySelector('.results-content');
            if (resultsContainer) {
                complianceInfo = document.createElement('div');
                complianceInfo.id = 'compliance-info';
                complianceInfo.style.cssText = `
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 25px;
                    border-radius: 15px;
                    margin: 20px 0;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
                    animation: fadeIn 0.5s ease-in;
                `;
                resultsContainer.insertBefore(complianceInfo, resultsContainer.firstChild);
            }
        }
        
        if (complianceInfo) {
            complianceInfo.style.display = 'block';
            complianceInfo.innerHTML = `
                <h3 style="margin: 0 0 15px 0; font-size: 20px; display: flex; align-items: center; gap: 10px;">
                    📊 Status Compliance Treatment
                    <span style="display: inline-block; width: 10px; height: 10px; background: #38ef7d; border-radius: 50%; animation: pulse 2s infinite;"></span>
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 15px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <span style="font-size: 28px; font-weight: bold; display: block; margin-bottom: 5px;">${completedTasks}</span>
                        <span style="font-size: 13px; opacity: 0.9;">Tugas Diselesaikan</span>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 15px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <span style="font-size: 28px; font-weight: bold; display: block; margin-bottom: 5px;">-${scoreImprovement}</span>
                        <span style="font-size: 13px; opacity: 0.9;">Pengurangan Score</span>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.15); padding: 15px; border-radius: 10px; backdrop-filter: blur(10px);">
                        <span style="font-size: 28px; font-weight: bold; display: block; margin-bottom: 5px;">${results.totalScore.toFixed(0)}</span>
                        <span style="font-size: 13px; opacity: 0.9;">Score Saat Ini</span>
                    </div>
                </div>
                <p style="margin-top: 15px; font-size: 13px; opacity: 0.95;">
                    💡 Data ini diperbarui secara otomatis setiap 2 detik. Setiap tugas mengurangi 1 poin dari skor trauma Anda.
                </p>
            `;
        }
    } else if (complianceInfo) {
        complianceInfo.style.display = 'none';
    }
}

// FUNGSI BARU: Notifikasi Visual saat ada Update
function showUpdateNotification() {
    // Buat notifikasi temporary
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = '✅ Score berhasil diperbarui!';
    
    document.body.appendChild(notification);
    
    // Hapus setelah 3 detik
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function goToTreatment() {
    window.location.href = 'treatment.html';
}

function saveResults() {
    // Simpan ke assessment history
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.latestAssessment) return;
    
    updateAssessmentHistory(currentUser.latestAssessment);
    alert('✅ Hasil assessment telah disimpan. Anda dapat melihat riwayat assessment di dashboard.');
}

function updateAssessmentHistory(assessment) {
    let assessmentHistory = JSON.parse(localStorage.getItem('assessmentHistory')) || [];
    
    // Cek apakah sudah ada entry dengan timestamp yang sama (dalam 1 menit terakhir)
    const now = new Date();
    const recentEntry = assessmentHistory.find(entry => {
        const entryDate = new Date(entry.date);
        const diffMinutes = (now - entryDate) / (1000 * 60);
        return entry.userId === assessment.userId && diffMinutes < 1;
    });
    
    if (!recentEntry) {
        // Tambahkan entry baru
        assessmentHistory.push({
            userId: assessment.userId,
            totalScore: assessment.totalScore,
            traumaLevel: assessment.traumaLevel,
            traumaDescription: assessment.traumaDescription,
            subscales: assessment.subscales,
            answers: assessment.formattedAnswers,
            recommendations: assessment.recommendations,
            interventions: assessment.interventions,
            date: new Date().toISOString(),
            source: 'manual_save'
        });
        
        localStorage.setItem('assessmentHistory', JSON.stringify(assessmentHistory));
    }
}

function printResults() {
    window.print();
}

// Style untuk animasi
const style = document.createElement('style');
style.textContent = `
    @keyframes scoreUpdate {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); color: #38ef7d; }
        100% { transform: scale(1); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
`;
document.head.appendChild(style);