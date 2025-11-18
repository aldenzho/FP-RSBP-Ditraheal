// Inisialisasi dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Cek auth
    const currentUser = checkAuth();
    
    // Tampilkan nama user
    document.getElementById('userName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
});