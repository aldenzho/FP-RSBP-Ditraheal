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
        // SUBSCALA INTRUSI (8 item)
        "Gambar atau pikiran tentang kejadian itu tiba-tiba muncul dalam pikiran saya",
        "Saya bermimpi buruk tentang kejadian itu",
        "Saya tiba-tiba merasa atau bertindak seolah-olah kejadian itu terulang kembali",
        "Saya merasa sangat terganggu ketika sesuatu mengingatkan saya pada kejadian itu",
        "Saya memiliki reaksi fisik (seperti jantung berdebar, kesulitan bernapas, berkeringat) ketika mengingat kejadian itu",
        "Saya mencoba untuk tidak memikirkan atau merasa tentang kejadian itu",
        "Saya merasa seolah-olah kejadian itu belum terjadi atau tidak nyata",
        "Saya tidak dapat mengingat beberapa bagian penting dari kejadian itu",
        
        // SUBSCALA PENGHINDARAN (8 item)
        "Saya menjauh dari hal-hal yang mengingatkan saya pada kejadian itu",
        "Saya menghindari memiliki perasaan tentang kejadian itu",
        "Saya menyadari bahwa saya masih memiliki banyak perasaan tentang kejadian itu, tetapi tidak berurusan dengan mereka",
        "Saya mencoba untuk menghapus kejadian itu dari ingatan saya",
        "Saya memiliki kesulitan untuk tetap tertidur",
        "Saya mudah tersinggung dan marah",
        "Saya mengalami kesulitan berkonsentrasi",
        "Pikiran atau perasaan tentang kejadian itu datang pada waktu yang tidak diinginkan",
        
        // SUBSCALA HIPERAROUSAL (6 item)
        "Saya mudah terkejut",
        "Saya merasa waspada dan berjaga-jaga",
        "Saya memiliki perasaan campur aduk tentang kejadian itu",
        "Saya mencoba untuk tidak membicarakan kejadian itu",
        "Gambar tentang kejadian itu muncul dalam pikiran saya",
        "Saya merasa gelisah dan gelisah, seolah-olah selalu waspada terhadap bahaya"
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
            
            // Hitung total skor (22-110 karena 22 pertanyaan × 1-5)
            const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
            
            // Konversi ke skor IES-R standar (0-88)
            // Rumus: (totalScore - 22) karena min skor = 22, max = 110
            const iesrScore = totalScore - 22;
            
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
            // 43+ = Very severe trauma / Sangat Tinggi (klinis)
            
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
            } else if (iesrScore <= 42) {
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
            } else {
                traumaLevel = 'Sangat Tinggi';
                traumaDescription = 'Skor IES-R Anda menunjukkan gejala trauma yang sangat tinggi dan memerlukan perhatian klinis segera. Sangat disarankan untuk mencari bantuan profesional intensif.';
                recommendations = [
                    {
                        title: 'Konsultasi Psikiatri Segera',
                        description: 'Segera konsultasikan dengan psikiater untuk evaluasi medis mendalam.'
                    },
                    {
                        title: 'Dukungan Intensif',
                        description: 'Libatkan keluarga dan teman dekat dalam proses pemulihan.'
                    }
                ];
                interventions = [
                    {
                        title: 'Terapi Trauma Intensif',
                        description: 'Terapi khusus untuk penanganan trauma yang komprehensif dan intensif.'
                    },
                    {
                        title: 'Perawatan Medis',
                        description: 'Konsultasi dan perawatan medis di bawah pengawasan psikiater.'
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