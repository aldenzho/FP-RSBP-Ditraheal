// public/js/treatment.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil Data User dan Hasil Assessment dengan KEY YANG BENAR
    // PERBAIKAN: Menggunakan 'currentUser' bukan 'user'
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // PERBAIKAN: Menggunakan 'currentAssessment' bukan 'traumaResult'
    const traumaResult = JSON.parse(localStorage.getItem('currentAssessment'));

    // Cek apakah data ada
    if (!currentUser || !traumaResult) {
        alert("Data tidak ditemukan. Silakan login dan lakukan asesmen terlebih dahulu.");
        // Pastikan path ini benar sesuai struktur folder Anda
        window.location.href = 'dashboard.html'; 
        return;
    }

    // Ambil Hobi (pastikan saat register hobi disimpan di objek currentUser)
    // Jika di register belum ada hobi, Anda mungkin perlu fallback default sementara
    const userHobby = currentUser.hobby || "Olahraga"; 

    // PERBAIKAN: Menggunakan property .traumaLevel bukan .level
    const traumaLevel = traumaResult.traumaLevel; 

    // Debugging (Opsional: Hapus nanti)
    console.log("User:", currentUser.username);
    console.log("Hobby:", userHobby);
    console.log("Level:", traumaLevel);

    // Tampilkan Nama User
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = currentUser.username;
    }

    // 2. KNOWLEDGE BASE (Basis Pengetahuan)
    // Berisi Rule dan Daftar Tugas
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

    // Fallback data untuk hobi lain agar tidak error (hanya contoh)
    const defaultData = treatmentKnowledgeBase["Olahraga"]["Rendah"];

    // 3. INFERENCE ENGINE (Mesin Pelacakan)
    // Mencari Rule: IF Hobby AND Level THEN Get Tasks
    let selectedTreatment = null;
    if (treatmentKnowledgeBase[userHobby] && treatmentKnowledgeBase[userHobby][traumaLevel]) {
        selectedTreatment = treatmentKnowledgeBase[userHobby][traumaLevel];
    } else {
        // Fallback jika kombinasi tidak ditemukan
        console.warn("Rule tidak ditemukan, menggunakan default.");
        selectedTreatment = defaultData; 
    }

    // 4. Render UI
    renderTreatmentPage(selectedTreatment);
});

function renderTreatmentPage(treatmentData) {
    const grid = document.getElementById('task-grid');
    const modelNameDisplay = document.getElementById('treatment-model-name');
    
    modelNameDisplay.textContent = treatmentData.modelName;
    grid.innerHTML = ''; // Clear grid

    // Cek progress tersimpan di LocalStorage (agar tidak reset saat refresh)
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

    // Simpan state ke LocalStorage
    let storedProgress = JSON.parse(localStorage.getItem('dailyTaskProgress')) || [];
    
    if (cardElement.classList.contains('completed')) {
        if (!storedProgress.includes(index)) storedProgress.push(index);
    } else {
        storedProgress = storedProgress.filter(i => i !== index);
    }
    
    localStorage.setItem('dailyTaskProgress', JSON.stringify(storedProgress));

    // Hitung ulang progress bar
    const totalTasks = cardElement.parentElement.children.length;
    updateProgressBar(totalTasks);
}

function updateProgressBar(totalTasks) {
    const storedProgress = JSON.parse(localStorage.getItem('dailyTaskProgress')) || [];
    const completedCount = storedProgress.length;
    const percentage = Math.round((completedCount / totalTasks) * 100);

    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}