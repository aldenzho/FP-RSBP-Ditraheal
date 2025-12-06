const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Simple in-memory storage (replace with database later)
let users = [];
let assessments = [];

// Load data from file if exists
try {
    if (fs.existsSync(path.join(dataDir, 'users.json'))) {
        const usersData = fs.readFileSync(path.join(dataDir, 'users.json'), 'utf8');
        users = JSON.parse(usersData);
    }
} catch (error) {
    console.log('No existing users data found, starting fresh');
}

// ===== AUTH ROUTES =====
app.post('/api/auth/register', (req, res) => {
    const { firstName, lastName, gender, age, instagram, email, password, hobby } = req.body;

    // Validation
    if (!firstName || !lastName || !gender || !age || !email || !password || !hobby) {
        return res.status(400).json({ 
            success: false, 
            message: 'Harap lengkapi semua field!' 
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password minimal 6 karakter!' 
        });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email sudah terdaftar!' 
        });
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        gender,
        age: parseInt(age),
        instagram,
        email,
        password, // In real app, hash this password
        hobby: hobby,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Save to file
    try {
        fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error saving users data:', error);
    }

    res.json({ 
        success: true, 
        message: 'Registrasi berhasil!',
        user: { ...newUser, password: undefined } // Don't send password back
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Harap isi email dan password!' 
        });
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ 
            success: false, 
            message: 'Email atau password salah!' 
        });
    }

    // Create simple token (in real app, use JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    res.json({
        success: true,
        message: 'Login berhasil!',
        user: { 
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gender: user.gender,
            age: user.age,
            instagram: user.instagram,
            hobby: user.hobby
        },
        token
    });
});

// ===== USER ROUTES =====
app.get('/api/users/profile', (req, res) => {
    // Simple auth check - in real app, use proper token verification
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token diperlukan!' 
        });
    }

    const user = users.find(u => u.id === req.headers['user-id']);
    
    if (!user) {
        return res.status(404).json({ 
            success: false, 
            message: 'User tidak ditemukan!' 
        });
    }

    res.json({
        success: true,
        user: { 
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gender: user.gender,
            age: user.age,
            instagram: user.instagram,
            hobby: user.hobby,
            createdAt: user.createdAt
        }
    });
});

// ===== SERVE HTML PAGES =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/assessment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'assessment.html'));
});

app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});

app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'results.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});


app.get('/assessment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'assessment.html'));
});

app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'results.html'));
});

// Di server.js, tambahkan route untuk profile
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});



// Start server
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('SERVER BERHASIL DIAKTIFKAN');
    console.log('='.repeat(60));
    console.log(`Server is running on: http://localhost:${PORT}`);
    console.log(`Sistem Pakar Penyembuhan Trauma`);
    console.log(`Data disimpan di: ${dataDir}`);
    console.log('⏰', new Date().toLocaleString('id-ID'));
    console.log('='.repeat(60));
    console.log('Tekan Ctrl+C untuk menghentikan server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nServer dimatikan');
    process.exit(0);
});

