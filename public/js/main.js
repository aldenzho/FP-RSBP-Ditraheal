// Inisialisasi aplikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Jika user sudah login, redirect ke dashboard
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'dashboard.html';
    }
    
    // Tambahkan event listener untuk form submit dengan Enter key
    document.getElementById('loginForm').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
    
    document.getElementById('registerForm').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            register();
        }
    });
});