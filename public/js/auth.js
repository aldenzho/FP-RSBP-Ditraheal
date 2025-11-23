// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (Utils.isLoggedIn() && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
        window.location.href = '/dashboard';
    }

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                Utils.showMessage('loginMessage', 'Harap isi email dan password!', 'error');
                return;
            }
            
            const result = await API.login(email, password);
            
            if (result.success) {
                // Save user data to localStorage
                localStorage.setItem('currentUser', JSON.stringify(result.data.user));
                localStorage.setItem('token', result.data.token);
                
                Utils.showMessage('loginMessage', 'Login berhasil! Mengarahkan...', 'success');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                Utils.showMessage('loginMessage', result.data.message || 'Login gagal!', 'error');
            }
        });
    }

    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const userData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                gender: document.getElementById('gender').value,
                age: parseInt(document.getElementById('age').value),
                instagram: document.getElementById('instagram').value,
                email: document.getElementById('registerEmail').value,
                password: document.getElementById('registerPassword').value,
                hobby: document.getElementById('hobby').value
            };

            // Validation
            if (!userData.firstName || !userData.lastName || !userData.gender || !userData.age || !userData.email || !userData.password) {
                Utils.showMessage('registerMessage', 'Harap lengkapi semua field!', 'error');
                return;
            }
            
            if (!Utils.isValidEmail(userData.email)) {
                Utils.showMessage('registerMessage', 'Format email tidak valid!', 'error');
                return;
            }
            
            if (userData.password.length < 6) {
                Utils.showMessage('registerMessage', 'Password minimal 6 karakter!', 'error');
                return;
            }

                if (!hobby) {
                document.getElementById('hobby-error').style.display = 'block';
                return;
            }
            
            const result = await API.register(userData);
            
            if (result.success) {
                Utils.showMessage('registerMessage', 'Registrasi berhasil! Silakan login.', 'success');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                Utils.showMessage('registerMessage', result.data.message || 'Registrasi gagal!', 'error');
            }
        });
    }

});

function selectHobby(value, element) {
    // 1. Reset semua kartu
    document.querySelectorAll('.hobby-card').forEach(card => {
        card.classList.remove('selected');
    });

    // 2. Tandai kartu yang diklik
    element.classList.add('selected');

    // 3. Simpan nilai ke input hidden
    document.getElementById('hobby').value = value;
    
    // 4. Sembunyikan error jika ada
    document.getElementById('hobby-error').style.display = 'none';
}