// assessment.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '/login';
        return;
    }

    // Data pertanyaan assessment
    const questions = [
        "Saya mengalami kilas balik (flashback) yang mengganggu tentang peristiwa traumatis",
        "Saya menghindari aktivitas atau situasi yang mengingatkan pada trauma",
        "Saya merasa mudah terkejut atau gugup",
        "Saya mengalami kesulitan tidur atau mimpi buruk",
        "Saya merasa sulit berkonsentrasi atau mengingat hal-hal penting"
    ];

    let currentQuestion = 0;
    const answers = [];

    // Initialize assessment
    updateProgress();
    showQuestion();
    
    // Event listeners untuk tombol
    document.getElementById('prevButton').addEventListener('click', goToPreviousQuestion);
    document.getElementById('nextButton').addEventListener('click', goToNextQuestion);
    document.getElementById('traumaAssessmentForm').addEventListener('submit', handleFormSubmit);
    
    // Event listener untuk radio buttons
    const radioInputs = document.querySelectorAll('input[name="currentQuestion"]');
    radioInputs.forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('nextButton').disabled = false;
        });
    });

    function showQuestion() {
        const questionText = document.getElementById('questionText');
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const submitButton = document.getElementById('submitButton');
        const currentQuestionSpan = document.getElementById('currentQuestion');
        const totalQuestionsSpan = document.getElementById('totalQuestions');
        
        // Update teks pertanyaan
        questionText.textContent = `${currentQuestion + 1}. ${questions[currentQuestion]}`;
        currentQuestionSpan.textContent = currentQuestion + 1;
        totalQuestionsSpan.textContent = questions.length;
        
        // Reset radio buttons
        const radioInputs = document.querySelectorAll('input[name="currentQuestion"]');
        radioInputs.forEach(radio => {
            radio.checked = false;
        });
        
        // Tampilkan jawaban sebelumnya jika ada
        if (answers[currentQuestion] !== undefined) {
            const previousAnswer = document.querySelector(`input[name="currentQuestion"][value="${answers[currentQuestion]}"]`);
            if (previousAnswer) {
                previousAnswer.checked = true;
                nextButton.disabled = false;
            }
        } else {
            nextButton.disabled = true;
        }
        
        // Update tombol navigasi
        prevButton.style.display = currentQuestion > 0 ? 'inline-block' : 'none';
        
        if (currentQuestion === questions.length - 1) {
            nextButton.style.display = 'none';
            submitButton.style.display = 'inline-block';
        } else {
            nextButton.style.display = 'inline-block';
            submitButton.style.display = 'none';
        }
        
        updateProgress();
    }

    function updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
    }

    function goToPreviousQuestion() {
        if (currentQuestion > 0) {
            saveCurrentAnswer();
            currentQuestion--;
            showQuestion();
        }
    }

    function goToNextQuestion() {
        if (validateCurrentQuestion()) {
            saveCurrentAnswer();
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion();
            }
        }
    }

    function saveCurrentAnswer() {
        const selectedRadio = document.querySelector('input[name="currentQuestion"]:checked');
        if (selectedRadio) {
            answers[currentQuestion] = parseInt(selectedRadio.value);
        }
    }

    function validateCurrentQuestion() {
        const selectedRadio = document.querySelector('input[name="currentQuestion"]:checked');
        if (!selectedRadio) {
            alert('Silakan pilih salah satu jawaban sebelum melanjutkan.');
            return false;
        }
        return true;
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        
        if (validateCurrentQuestion()) {
            saveCurrentAnswer();
            
            // Hitung total skor
            const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
            
            // Calculate trauma level dan rekomendasi (menggunakan logika dari kode sebelumnya)
            let traumaLevel = '';
            let traumaDescription = '';
            let recommendations = [];
            let interventions = [];
            
            if (totalScore <= 10) {
                traumaLevel = 'Rendah';
                traumaDescription = 'Anda menunjukkan gejala trauma yang rendah. Kondisi ini menunjukkan kemampuan koping yang baik dalam menghadapi stres.';
                recommendations = [
                    {
                        title: 'Pertahankan Gaya Hidup Sehat',
                        description: 'Terus lakukan aktivitas fisik rutin dan pola tidur yang teratur.'
                    },
                    {
                        title: 'Pengembangan Diri',
                        description: 'Manfaatkan waktu untuk mengembangkan hobi dan keterampilan baru.'
                    }
                ];
                interventions = [
                    {
                        title: 'Psikoedukasi',
                        description: 'Pemahaman tentang manajemen stres dan resilience.'
                    },
                    {
                        title: 'Support System',
                        description: 'Mempertahankan jaringan sosial yang sehat.'
                    }
                ];
            } else if (totalScore <= 15) {
                traumaLevel = 'Sedang';
                traumaDescription = 'Anda mengalami beberapa gejala trauma yang membutuhkan perhatian. Disarankan untuk mencari dukungan profesional.';
                recommendations = [
                    {
                        title: 'Konsultasi Profesional',
                        description: 'Pertimbangkan untuk berkonsultasi dengan psikolog atau konselor.'
                    },
                    {
                        title: 'Teknik Relaksasi',
                        description: 'Praktikkan teknik pernapasan dan meditasi secara rutin.'
                    }
                ];
                interventions = [
                    {
                        title: 'Terapi Kognitif',
                        description: 'Membantu mengidentifikasi dan mengubah pola pikir negatif.'
                    },
                    {
                        title: 'Mindfulness',
                        description: 'Latihan kesadaran penuh untuk mengurangi kecemasan.'
                    }
                ];
            } else {
                traumaLevel = 'Tinggi';
                traumaDescription = 'Anda menunjukkan gejala trauma yang signifikan. Sangat disarankan untuk segera mencari bantuan profesional.';
                recommendations = [
                    {
                        title: 'Konsultasi Segera',
                        description: 'Segera hubungi psikolog atau psikiater untuk penanganan profesional.'
                    },
                    {
                        title: 'Dukungan Sosial',
                        description: 'Jangan ragu untuk meminta dukungan dari keluarga dan teman dekat.'
                    }
                ];
                interventions = [
                    {
                        title: 'Trauma-Focused Therapy',
                        description: 'Terapi khusus untuk penanganan trauma yang komprehensif.'
                    },
                    {
                        title: 'Medical Intervention',
                        description: 'Konsultasi mengenai kemungkinan intervensi medis jika diperlukan.'
                    }
                ];
            }
            
            // Format answers untuk kompatibilitas dengan kode sebelumnya
            const formattedAnswers = {};
            answers.forEach((answer, index) => {
                formattedAnswers[`question${index + 1}`] = answer;
            });
            
            // Save results to localStorage
            const assessmentResults = {
                userId: currentUser.id,
                totalScore: totalScore,
                traumaLevel: traumaLevel,
                traumaDescription: traumaDescription,
                answers: formattedAnswers,
                recommendations: recommendations,
                interventions: interventions,
                date: new Date().toISOString()
            };
            
            localStorage.setItem('currentAssessment', JSON.stringify(assessmentResults));
            
            // Save to assessment history
            let assessmentHistory = JSON.parse(localStorage.getItem('assessmentHistory')) || [];
            assessmentHistory.push(assessmentResults);
            localStorage.setItem('assessmentHistory', JSON.stringify(assessmentHistory));
            
            // Update user's latest assessment
            currentUser.latestAssessment = assessmentResults;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Redirect to results page
            window.location.href = '/results';
        }
    }
});