document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil Data User dan Hasil Assessment
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const traumaResult = currentUser ? currentUser.latestAssessment : null;

    // Cek apakah data ada
    if (!currentUser || !traumaResult) {
        alert("Data tidak ditemukan. Silakan login dan lakukan asesmen terlebih dahulu.");
        window.location.href = 'dashboard.html';
        return;
    }

    // Ambil Hobi
    const userHobby = currentUser.hobby || "Olahraga";
    const traumaLevel = traumaResult.traumaLevel;

    // Tampilkan Nama User
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = currentUser.username;
    }

    // 2. KNOWLEDGE BASE (Basis Pengetahuan)
    const treatmentKnowledgeBase = {
        "Musik": {
            "Rendah": {
                modelName: "Terapi Musik Relaksasi Ringan",
                tasks: [
                    "Dengarkan playlist akustik selama 15 menit.",
                    "Senandung lagu favorit saat mandi pagi.",
                    "Cari lirik lagu yang memotivasi.",
                    "Dengarkan suara alam (hujan/ombak) sebelum tidur.",
                    "Mainkan satu instrumen (atau ketuk meja) mengikuti irama.",
                    "Tonton 1 video musik yang ceria.",
                    "Buat playlist 'Mood Booster'.",
                    "Bernyanyi kecil sambil melakukan aktivitas ringan."
                ]
            },
            "Sedang": {
                modelName: "Terapi Musik Emosional",
                tasks: [
                    "Dengarkan lagu instrumental 432Hz untuk ketenangan.",
                    "Tuliskan perasaanmu setelah mendengar lagu sedih.",
                    "Bernyanyi karaoke satu lagu penuh.",
                    "Dengarkan musik klasik saat bekerja/belajar.",
                    "Lakukan latihan pernapasan diiringi musik slow.",
                    "Hindari lagu berlirik agresif hari ini.",
                    "Dengarkan musik nostalgia masa kecil yang bahagia.",
                    "Gerakkan tubuh mengikuti irama lagu upbeat."
                ]
            },
            "Tinggi": {
                modelName: "Terapi Musik Intensif & Meditatif",
                tasks: [
                    "Meditasi musik binaural beats selama 20 menit.",
                    "Dengarkan musik tanpa lirik di ruangan gelap.",
                    "Jauhi suara bising, fokus pada satu melodi instrumen.",
                    "Terapi musik: Gambar apa yang kamu rasakan dari lagu.",
                    "Dengarkan rekaman afirmasi positif dengan latar musik.",
                    "Buat jurnal audio tentang perasaan hari ini.",
                    "Dengarkan lagu dengan tempo lambat (60 bpm) untuk detak jantung.",
                    "Tidur dengan white noise atau brown noise."
                ]
            }
        },
        "Seni": {
            "Rendah": {
                modelName: "Seni Kreatif Ringan",
                tasks: [
                    "Warnai satu halaman coloring book.",
                    "Doodle (coret-coret) bebas di kertas kosong.",
                    "Tata ulang dekorasi meja kerjamu.",
                    "Lihat galeri seni online (Pinterest/Instagram) 10 menit.",
                    "Lipat origami bentuk sederhana.",
                    "Ambil 3 foto objek menarik di sekitarmu.",
                    "Gambar ekspresi wajahmu hari ini.",
                    "Susun palet warna yang menenangkan mata."
                ]
            },
            "Sedang": {
                modelName: "Seni Ekspresif",
                tasks: [
                    "Gambar perasaanmu dalam bentuk abstrak.",
                    "Buat kolase dari potongan majalah/kertas bekas.",
                    "Melukis dengan cat air atau jari (finger painting).",
                    "Buat kerajinan tangan sederhana dari barang bekas.",
                    "Tulis puisi pendek 4 baris.",
                    "Fotografi alam: Potret langit atau tanaman.",
                    "Sketsa objek di depanmu dalam 5 menit.",
                    "Hias jurnal harianmu dengan stiker atau gambar."
                ]
            },
            "Tinggi": {
                modelName: "Terapi Seni Mendalam",
                tasks: [
                    "Gambar mandala untuk memusatkan pikiran.",
                    "Lakukan 'Clay Therapy' (membentuk tanah liat/playdough).",
                    "Gambar 'Safe Place' (tempat aman) versi kamu.",
                    "Buat surat visual untuk diri sendiri di masa lalu.",
                    "Lukis emosi negatif, lalu robek kertasnya (pelepasan).",
                    "Jurnal visual: Gambar satu hal yang disyukuri.",
                    "Fokus mewarnai pola geometri rumit.",
                    "Buat peta emosi menggunakan warna berbeda."
                ]
            }
        },
        "Membaca / Menonton": {
            "Rendah": {
                modelName: "Literasi & Hiburan Ringan",
                tasks: [
                    "Baca 5 halaman novel fiksi ringan atau komik.",
                    "Tonton 1 episode sitkom/komedi durasi pendek.",
                    "Baca kutipan (quotes) motivasi pagi hari.",
                    "Tonton video dokumenter alam atau hewan lucu.",
                    "Baca majalah hobi atau artikel blog favorit.",
                    "Dengarkan audiobook ceria sambil beres-beres.",
                    "Tonton video tutorial memasak atau DIY singkat.",
                    "Hindari berita negatif (doomscrolling) hari ini."
                ]
            },
            "Sedang": {
                modelName: "Bibliotherapy Reflektif",
                tasks: [
                    "Baca biografi tokoh inspiratif (1 bab).",
                    "Tonton film dengan tema perjuangan hidup (inspiring movie).",
                    "Baca artikel psikologi populer tentang emosi.",
                    "Tonton TED Talk tentang pengembangan diri.",
                    "Tulis review singkat tentang buku/film yang baru dilihat.",
                    "Baca puisi yang mewakili perasaanmu.",
                    "Dengarkan podcast wawancara yang mendalam.",
                    "Cari rekomendasi buku 'Feel Good' dan mulai baca."
                ]
            },
            "Tinggi": {
                modelName: "Bibliotherapy Pemulihan & Edukasi",
                tasks: [
                    "Baca buku Self-Help tentang pemulihan trauma.",
                    "Tonton konten 'Slow TV' (pemandangan kereta/hutan) untuk relaksasi.",
                    "Baca kitab suci atau buku spiritual (jika relevan) untuk ketenangan.",
                    "Tonton video panduan grounding technique.",
                    "Baca kisah survivor yang berhasil bangkit.",
                    "Tonton ulang film masa kecil yang memberi rasa aman.",
                    "Hindari konten thriller/horror sepenuhnya hari ini.",
                    "Dengarkan rekaman relaksasi visual (ASMR visual)."
                ]
            }
        },
        "Olahraga": {
            "Rendah": {
                modelName: "Aktivitas Fisik Ringan",
                tasks: [
                    "Jalan santai keliling kompleks 15 menit.",
                    "Peregangan (stretching) ringan setelah bangun tidur.",
                    "Lakukan gerakan 'Child Pose' selama 3 menit.",
                    "Jalan kaki tanpa alas di rumput (grounding).",
                    "Menari bebas mengikuti 1 lagu favorit.",
                    "Naik turun tangga dengan santai 3 kali.",
                    "Bersihkan kamar (aktivitas fisik produktif).",
                    "Lakukan gerakan leher dan bahu untuk lepas tegangan."
                ]
            },
            "Sedang": {
                modelName: "Olahraga Kardio & Ritme",
                tasks: [
                    "Jogging pagi atau sore selama 20 menit.",
                    "Berenang santai untuk melatih pernapasan.",
                    "Bersepeda keliling lingkungan.",
                    "Lakukan lompat tali (skipping) 3 set ringan.",
                    "Ikuti video senam aerobik pemula 15 menit.",
                    "Lakukan 'Brisk Walking' (jalan cepat).",
                    "Olahraga permainan (badminton/basket) santai.",
                    "Capai target 6.000 langkah hari ini."
                ]
            },
            "Tinggi": {
                modelName: "Somatic Healing & Yoga",
                tasks: [
                    "Yoga restoratif (fokus relaksasi) 20 menit.",
                    "Lakukan teknik relaksasi otot progresif (PMR).",
                    "Tai Chi atau Qigong untuk keseimbangan energi.",
                    "Meditasi berjalan (jalan sangat lambat & sadar).",
                    "Lakukan pose 'Legs Up The Wall' selama 10 menit.",
                    "Latihan pernapasan diafragma sambil berbaring.",
                    "Stretching fokus pada panggul dan dada (penyimpan emosi).",
                    "Gerakan shaking (menggetarkan tubuh) untuk lepas trauma."
                ]
            }
        }
    };

    // Fallback data
    const defaultData = treatmentKnowledgeBase["Olahraga"]["Rendah"];

    // 3. INFERENCE ENGINE
    let selectedTreatment = null;
    if (treatmentKnowledgeBase[userHobby] && treatmentKnowledgeBase[userHobby][traumaLevel]) {
        selectedTreatment = treatmentKnowledgeBase[userHobby][traumaLevel];
    } else {
        console.warn("Rule tidak ditemukan, menggunakan default.");
        selectedTreatment = defaultData;
    }

    // 4. Render UI
    renderTreatmentPage(selectedTreatment);

    // Update preview setiap kali ada perubahan
    updateSavePreview();
});

function renderTreatmentPage(treatmentData) {
    const grid = document.getElementById('task-grid');
    const modelNameDisplay = document.getElementById('treatment-model-name');

    modelNameDisplay.textContent = treatmentData.modelName;
    grid.innerHTML = '';

    // Cek progress tersimpan di LocalStorage
    const storedProgress = JSON.parse(localStorage.getItem('dailyTaskProgress')) || [];

    treatmentData.tasks.forEach((taskText, index) => {
        const isCompleted = storedProgress.includes(index);

        const card = document.createElement('div');
        card.className = `task-card ${isCompleted ? 'completed' : ''}`;
        card.onclick = () => toggleTask(index, card);

        card.innerHTML = `
            <div>
                <div class="task-title">Tugas #${index + 1}</div>
                <div class="task-desc">${taskText}</div>
            </div>
            <div class="task-status">${isCompleted ? 'Selesai' : 'Belum Selesai'}</div>
        `;

        grid.appendChild(card);
    });

    updateProgressBar(treatmentData.tasks.length);
}

function toggleTask(index, cardElement) {
    cardElement.classList.toggle('completed');

    // Update status text visual
    const statusText = cardElement.querySelector('.task-status');
    if (cardElement.classList.contains('completed')) {
        statusText.textContent = 'Selesai';
    } else {
        statusText.textContent = 'Belum Selesai';
    }

    // Simpan state ke LocalStorage (HANYA STATUS, BELUM UPDATE SCORE)
    let storedProgress = JSON.parse(localStorage.getItem('dailyTaskProgress')) || [];

    if (cardElement.classList.contains('completed')) {
        if (!storedProgress.includes(index)) {
            storedProgress.push(index);
        }
    } else {
        storedProgress = storedProgress.filter(i => i !== index);
    }

    localStorage.setItem('dailyTaskProgress', JSON.stringify(storedProgress));

    // Hitung ulang progress bar
    const totalTasks = cardElement.parentElement.children.length;
    updateProgressBar(totalTasks);

    // Update preview perubahan
    updateSavePreview();
}

function updateProgressBar(totalTasks) {
    const storedProgress = JSON.parse(localStorage.getItem('dailyTaskProgress')) || [];
    const completedCount = storedProgress.length;
    const percentage = Math.round((completedCount / totalTasks) * 100);

    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    if (progressBar && progressText) {
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}%`;
    }
}

// FUNGSI BARU: Update Preview Perubahan Score (1 POIN PER TUGAS)
function updateSavePreview() {
    const storedProgress = JSON.parse(localStorage.getItem('dailyTaskProgress')) || [];
    const completedCount = storedProgress.length;
    const scoreReduction = completedCount * 1; // DIUBAH DARI 0.5 MENJADI 1 POIN

    const previewBox = document.getElementById('save-preview');
    const previewText = document.getElementById('preview-text');

    if (previewBox && previewText) {
        if (completedCount > 0) {
            previewBox.style.display = 'block';
            previewText.textContent = `Tugas yang diselesaikan: ${completedCount} | Pengurangan Score: -${scoreReduction} poin`;
        } else {
            previewBox.style.display = 'none';
        }
    }
}

// FUNGSI UTAMA: Simpan Progress dan Update Score (1 POIN PER TUGAS)
function saveProgress() {
    const storedProgress = JSON.parse(localStorage.getItem('dailyTaskProgress')) || [];
    const completedCount = storedProgress.length;

    if (completedCount === 0) {
        alert('⚠️ Belum ada tugas yang diselesaikan. Silakan selesaikan minimal 1 tugas terlebih dahulu.');
        return;
    }

    // Konfirmasi dari user (1 POIN PER TUGAS)
    const scoreReduction = completedCount * 1; // DIUBAH DARI 0.5 MENJADI 1 POIN
    const confirmed = confirm(
        `Apakah Anda yakin ingin menyimpan progress?\n\n` +
        `📊 Detail:\n` +
        `- Tugas diselesaikan: ${completedCount}\n` +
        `- Pengurangan score: -${scoreReduction} poin\n\n` +
        `Score akan langsung diupdate di hasil assessment Anda.`
    );

    if (!confirmed) {
        return;
    }

    // Ambil data user saat ini
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || !currentUser.latestAssessment) {
        alert('❌ Data assessment tidak ditemukan. Silakan lakukan assessment terlebih dahulu.');
        return;
    }

    const currentAssessment = currentUser.latestAssessment;

    // Simpan score lama untuk log
    const oldScore = currentAssessment.totalScore;
    const oldLevel = currentAssessment.traumaLevel;

    // Update score (dikurangi karena semakin rendah semakin baik) - 1 POIN PER TUGAS
    let newScore = oldScore - scoreReduction;

    // Batasi score minimum 0 dan maksimum 88
    newScore = Math.max(0, Math.min(88, newScore));

    currentAssessment.totalScore = newScore;

    // Tentukan level trauma baru berdasarkan score IES-R
    // IES-R Standar cut-off (dalam skor 0-88):
    // 0-23 = Minimal trauma / Rendah
    // 24-32 = Mild trauma / Ringan  
    // 33-36 = Moderate trauma / Sedang
    // 37-88 = Severe trauma / Tinggi
    if (newScore <= 23) {
        currentAssessment.traumaLevel = 'Rendah';
    } else if (newScore <= 32) {
        currentAssessment.traumaLevel = 'Ringan';
    } else if (newScore <= 36) {
        currentAssessment.traumaLevel = 'Sedang';
    } else {
        currentAssessment.traumaLevel = 'Tinggi';
    }

    const newLevel = currentAssessment.traumaLevel;

    // Update trauma description sesuai level baru
    currentAssessment.traumaDescription = getTraumaDescription(newLevel);

    // Update di object user dan simpan ke localStorage
    currentUser.latestAssessment = currentAssessment;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update assessment history untuk chart
    updateAssessmentHistory(currentAssessment);

    // Reset daily progress setelah disimpan
    localStorage.removeItem('dailyTaskProgress');

    // Tampilkan hasil
    alert(
        `✅ Progress berhasil disimpan!\n\n` +
        `📊 Perubahan Score:\n` +
        `- Score Lama: ${oldScore.toFixed(0)} (${oldLevel})\n` +
        `- Score Baru: ${newScore.toFixed(0)} (${newLevel})\n` +
        `- Pengurangan: -${scoreReduction} poin\n\n` +
        `🎉 Lihat detail di halaman Hasil Assessment!`
    );

    // Redirect ke halaman results
    setTimeout(() => {
        window.location.href = 'results.html';
    }, 1000);
}

// FUNGSI: Get Trauma Description berdasarkan Level
function getTraumaDescription(level) {
    const descriptions = {
        'Rendah': 'Gejala trauma yang Anda alami berada dalam tingkat yang rendah. Ini menunjukkan kemampuan adaptasi yang baik terhadap stres. Tetap pertahankan gaya hidup sehat dan dukungan sosial.',
        'Ringan': 'Anda mengalami gejala trauma ringan. Disarankan untuk tetap melakukan aktivitas self-care dan memantau perkembangan gejala.',
        'Sedang': 'Anda mengalami beberapa gejala trauma yang memerlukan perhatian. Disarankan untuk mencari dukungan profesional dan menerapkan teknik manajemen stres secara konsisten.',
        'Tinggi': 'Gejala trauma yang dialami memerlukan penanganan profesional segera. Sangat disarankan untuk berkonsultasi dengan ahli kesehatan mental untuk mendapatkan perawatan yang tepat.'
    };
    
    return descriptions[level] || 'Silakan konsultasi dengan profesional kesehatan mental.';
}

// FUNGSI: Update Assessment History untuk Chart
function updateAssessmentHistory(assessment) {
    let assessmentHistory = JSON.parse(localStorage.getItem('assessmentHistory')) || [];

    // Tambahkan entry baru dengan timestamp
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
        source: 'treatment_completion' // Penanda bahwa ini dari penyelesaian treatment
    });

    localStorage.setItem('assessmentHistory', JSON.stringify(assessmentHistory));
}

// FUNGSI: Reset Tugas Hari Ini
function resetTasks() {
    const confirmed = confirm('🔄 Apakah Anda yakin ingin mereset semua tugas hari ini?\n\nCatatan: Score tidak akan berubah, hanya status tugas yang direset.');

    if (confirmed) {
        localStorage.removeItem('dailyTaskProgress');
        location.reload();
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}