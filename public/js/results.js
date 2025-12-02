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
    
    // Tambahkan event listener untuk tombol
    document.getElementById('treatmentBtn').addEventListener('click', goToTreatment);
});function displayResults(results) {
    // Display total score
    const totalScoreElement = document.getElementById('totalScore');
    if (totalScoreElement) {
        // Tampilkan skor IES-R (0-88) bukan total skor mentah
        const iesrScore = results.iesrScore || (results.totalScore - 22);
        totalScoreElement.textContent = iesrScore.toFixed(0);
    }
    
    // Display trauma level with appropriate styling
    const traumaLevelElement = document.getElementById('traumaLevel');
    if (traumaLevelElement) {
        // Pastikan level trauma sesuai dengan yang dihasilkan di assessment.js
        traumaLevelElement.textContent = results.traumaLevel;
        // Update class untuk warna yang sesuai
        traumaLevelElement.className = 'level-badge ' + results.traumaLevel.toLowerCase().replace(/\s+/g, '-');
    }
    
    // Update progress bar and marker berdasarkan IES-R yang benar
    const progressFill = document.getElementById('traumaProgress');
    const progressMarker = document.getElementById('traumaMarker');
    
    if (progressFill && progressMarker) {
        const iesrScore = results.iesrScore || (results.totalScore - 22);
        
        // Skala IES-R 0-88 dengan 5 kategori yang digunakan di assessment.js:
        // Rendah (0-23), Ringan (24-32), Sedang (33-36), Tinggi (37-42), Sangat Tinggi (43-88)
        
        // Tentukan posisi marker berdasarkan skor aktual (0-100%)
        const markerPosition = Math.min((iesrScore / 88) * 100, 100);
        
        // Tentukan progress width berdasarkan kategori yang sesuai
        // Kita akan isi progress bar sampai batas kategori
        let progressWidth = 0;
        
        if (iesrScore <= 23) {
            // Rendah: isi sampai 23/88 = 26.14%
            progressWidth = (23 / 88) * 100;
        } else if (iesrScore <= 32) {
            // Ringan: isi sampai 32/88 = 36.36%
            progressWidth = (32 / 88) * 100;
        } else if (iesrScore <= 36) {
            // Sedang: isi sampai 36/88 = 40.91%
            progressWidth = (36 / 88) * 100;
        } else if (iesrScore <= 42) {
            // Tinggi: isi sampai 42/88 = 47.73%
            progressWidth = (42 / 88) * 100;
        } else {
            // Sangat Tinggi: isi penuh
            progressWidth = 100;
        }
        
        progressFill.style.width = progressWidth + '%';
        progressMarker.style.left = markerPosition + '%';
        
        // Untuk debugging, bisa dihapus setelah fix
        console.log(`Skor IES-R: ${iesrScore}, Level: ${results.traumaLevel}, Marker: ${markerPosition}%, Progress: ${progressWidth}%`);
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
}

function getTraumaDescription(level) {
    const descriptions = {
        'Rendah': 'Gejala trauma yang Anda alami berada dalam tingkat yang rendah. Ini menunjukkan kemampuan adaptasi yang baik terhadap stres. Tetap pertahankan gaya hidup sehat dan dukungan sosial.',
        'Sedang': 'Anda mengalami beberapa gejala trauma yang memerlukan perhatian. Disarankan untuk mencari dukungan profesional dan menerapkan teknik manajemen stres secara konsisten.',
        'Tinggi': 'Gejala trauma yang dialami memerlukan penanganan profesional segera. Sangat disarankan untuk berkonsultasi dengan ahli kesehatan mental untuk mendapatkan perawatan yang tepat.',
        'Sangat Tinggi': 'Gejala trauma yang dialami sangat signifikan dan memerlukan penanganan profesional intensif. Segera konsultasikan dengan ahli kesehatan mental untuk evaluasi mendalam.'
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
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    });
    
    // Gunakan skor IES-R untuk chart
    const scores = userAssessments.map(assessment => {
        return assessment.iesrScore || (assessment.totalScore - 22);
    });
    
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
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Progress Skor IES-R',
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
                            return 'Skor IES-R: ' + context.parsed.y.toFixed(0);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 88,
                    title: {
                        display: true,
                        text: 'Skor IES-R (0-88)'
                    },
                    ticks: {
                        stepSize: 10
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
        iesrScore: assessment.iesrScore || (assessment.totalScore - 22),
        traumaLevel: assessment.traumaLevel,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('assessmentHistory', JSON.stringify(assessmentHistory));
}

function printResults() {
    window.print();
}