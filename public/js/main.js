// Inisialisasi aplikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // ===== AUTH CHECK =====
    // Jika user sudah login, redirect ke dashboard (hanya untuk halaman auth)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isAuthPage = window.location.pathname === '/login' || 
                      window.location.pathname === '/register' || 
                      window.location.pathname === '/';
    
    if (currentUser && isAuthPage) {
        window.location.href = '/dashboard';
    }
    
    // ===== FORM HANDLERS =====
    // Tambahkan event listener untuk form submit dengan Enter key
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                register();
            }
        });
    }
    
    // ===== NAVIGATION & UI =====
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Skip smooth scroll for login/register buttons in navbar
            if (this.classList.contains('btn-login') || this.classList.contains('btn-register')) {
                return;
            }
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = document.querySelector('.navbar')?.offsetHeight || 70;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== ADDITIONAL FEATURES =====
    
    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'var(--shadow)';
            }
        }
    });
    
    // Animation on scroll for feature cards
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .step, .stat');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .step, .stat');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Update navbar auth state based on login status
    updateNavbarAuthState();
});

// Function to update navbar based on auth state
function updateNavbarAuthState() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navMenu = document.querySelector('.nav-menu');
    
    if (navMenu && currentUser) {
        // User is logged in - update navbar
        const authButtons = navMenu.querySelector('.auth-buttons');
        if (!authButtons) {
            const authButtonsContainer = document.createElement('div');
            authButtonsContainer.className = 'auth-buttons';
            authButtonsContainer.innerHTML = `
                <span class="nav-user">Halo, ${currentUser.firstName}</span>
                <a href="/dashboard" class="nav-link btn-primary">Dashboard</a>
                <a href="#" class="nav-link btn-logout" onclick="logout()">Keluar</a>
            `;
            
            // Replace existing auth buttons
            const existingLogin = navMenu.querySelector('.btn-login');
            const existingRegister = navMenu.querySelector('.btn-register');
            
            if (existingLogin && existingRegister) {
                existingLogin.remove();
                existingRegister.remove();
                navMenu.appendChild(authButtonsContainer);
            }
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    window.location.href = '/';
}