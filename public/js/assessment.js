// assessment.js - IES-R 22 Item Standard
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Data pertanyaan IES-R (22 Item Standar) - Skala Likert 1-5
    const questions = [
        // ● Intrusion (8 items: 1, 2, 3, 6, 9, 14, 16, 20): intrusive thoughts, nightmares, intrusive feelings, and imagery associated with the traumatic event (range 0-32)
        "Setiap pengingat membuat saya kembali merasakan perasaan tentang hal itu",
        "Saya mengalami kesulitan untuk tetap tertidur",
        "Hal-hal lain terus membuat saya memikirkannya",
        "Saya memikirkannya tanpa saya maksudkan",
        "Gambaran tentang itu muncul begitu saja di pikiran saya",
        "Saya mendapati diri saya bertindak atau merasa seolah-olah saya kembali ke waktu itu",
        "Saya merasakan gelombang perasaan kuat tentang hal itu",
        "Saya mengalami mimpi tentang hal itu",
        
        // ● Avoidance (8 items: 5, 7, 8, 11, 12, 13, 17, 22): efforts to avoid trauma-related thoughts, feelings, or reminders, as well as numbing of responsiveness (range 0-32)
        "Saya menghindari membuat diri saya menjadi sedih ketika saya memikirkannya atau ketika saya diingatkan tentang itu",
        "Saya merasa seolah-olah itu tidak pernah terjadi atau tidak nyata",
        "Saya menjauhi hal-hal yang mengingatkan saya tentang itu",
        "Saya berusaha untuk tidak memikirkannya",
        "Saya sadar bahwa saya masih memiliki banyak perasaan tentang itu, tetapi saya tidak menanganinya",
        "Perasaan saya tentang hal itu terasa tumpul atau mati rasa",
        "Saya berusaha menghapusnya dari ingatan saya",
        "Saya berusaha untuk tidak membicarakannya",
        
        // ● Hyperarousal (6 items: 4, 10, 15, 18, 19, 21): heightened physiological arousal and reactivity following the trauma (range 0-24)
        "Saya merasa mudah tersinggung dan marah",
        "Saya mudah terkejut dan mudah kaget",
        "Saya mengalami kesulitan untuk memulai tidur",
        "Saya mengalami kesulitan untuk berkonsentrasi",
        "Pengingat tentang hal itu menyebabkan reaksi fisik, seperti berkeringat, sulit bernapas, mual, atau jantung berdebar",
        "Saya merasa waspada atau selalu berjaga-jaga"
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
            
            const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
            
            const iesrScore = totalScore;
            
            // Calculate trauma level dan rekomendasi berdasarkan IES-R
            let traumaLevel = '';
            let traumaDescription = '';
            let recommendations = [];
            let interventions = [];
            
            // RULES SYSTEM berdasarkan IES-R cut-off points YANG BENAR
            // IES-R Standar cut-off (dalam skor 0-88):
            // 0-23 = Minimal trauma / Low
            // 24-32 = Mild trauma / Ringan  
            // 33-36 = Moderate trauma / Sedang
            // 37-88 = Severe trauma / Tinggi
            
            if (iesrScore <= 23) {
                traumaLevel = 'Rendah';
                traumaDescription = 'Skor IES-R Anda menunjukkan gejala trauma yang rendah (minimal). Kondisi ini menunjukkan kemampuan koping yang baik dalam menghadapi stres. Tetap pertahankan gaya hidup sehat dan dukungan sosial.';
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
            } else if (iesrScore <= 32) {
                traumaLevel = 'Ringan';
                traumaDescription = 'Skor IES-R Anda menunjukkan gejala trauma ringan. Anda mungkin mengalami beberapa gejala yang mengganggu, namun masih dalam batas yang dapat dikelola dengan strategi koping yang baik.';
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
            } else if (iesrScore <= 36) {
                traumaLevel = 'Sedang';
                traumaDescription = 'Skor IES-R Anda menunjukkan gejala trauma yang sedang. Anda mengalami gejala yang signifikan dan disarankan untuk mencari dukungan profesional.';
                recommendations = [
                    {
                        title: 'Konsultasi Profesional',
                        description: 'Segera konsultasikan dengan psikolog atau konselor untuk evaluasi lebih lanjut.'
                    },
                    {
                        title: 'Manajemen Stres',
                        description: 'Pelajari teknik manajemen stres yang efektif dan terapkan dalam kehidupan sehari-hari.'
                    }
                ];
                interventions = [
                    {
                        title: 'Terapi Kognitif-Perilaku',
                        description: 'Terapi untuk mengidentifikasi dan mengubah pola pikir serta perilaku negatif.'
                    },
                    {
                        title: 'Kelompok Support',
                        description: 'Bergabung dengan kelompok dukungan untuk berbagi pengalaman dan strategi koping.'
                    }
                ];
            } else if (iesrScore <= 88) {
                traumaLevel = 'Tinggi';
                traumaDescription = 'Skor IES-R Anda menunjukkan gejala trauma yang tinggi. Sangat disarankan untuk segera mencari bantuan profesional untuk penanganan yang tepat.';
                recommendations = [
                    {
                        title: 'Konsultasi Segera',
                        description: 'Segera hubungi psikolog klinis atau psikiater untuk penanganan profesional.'
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
                        title: 'Medical Consultation',
                        description: 'Konsultasi mengenai kemungkinan intervensi medis jika diperlukan.'
                    }
                ];
            }
            
            // Hitung subskala IES-R
            const subscales = {
                intrusion: answers.slice(0, 8).reduce((sum, answer) => sum + answer, 0),
                avoidance: answers.slice(8, 16).reduce((sum, answer) => sum + answer, 0),
                hyperarousal: answers.slice(16, 22).reduce((sum, answer) => sum + answer, 0)
            };
            
            // Format answers untuk kompatibilitas dengan kode sebelumnya
            const formattedAnswers = {};
            answers.forEach((answer, index) => {
                formattedAnswers[`question${index + 1}`] = answer;
            });
            
            // Save results to localStorage
            const assessmentResults = {
                userId: currentUser.id,
                totalScore: totalScore,
                iesrScore: iesrScore,
                traumaLevel: traumaLevel,
                traumaDescription: traumaDescription,
                subscales: subscales,
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
            window.location.href = 'results.html';
        }
    }
});