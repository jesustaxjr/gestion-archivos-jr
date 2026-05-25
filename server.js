const express = require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Importar nuestros módulos
const db = require('./config/database');
const initDatabase = require('./models/schema');
const authMiddleware = require('./middleware/auth');
const fileController = require('./controllers/fileController');

const app = express();

// 1. Inicializar Base de Datos (crea tablas y usuarios de prueba)
initDatabase();

// 2. Configurar Express y Vistas
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// 3. Proteger la carpeta de descargas (Solo logueados pueden descargar)
app.use('/uploads', authMiddleware, express.static(path.join(__dirname, 'public/uploads')));

// 4. Configurar Sesiones
app.use(session({
    secret: 'clave_secreta_jr_2026',
    resave: false,
    saveUninitialized: false
}));

// 5. Configurar Multer (Manejo de archivos subidos)
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'public/uploads/'); },
    filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        cb(null, `${uniqueId}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// ================= RUTAS DE AUTENTICACIÓN =================

app.get('/login', (req, res) => {
    if (req.session.userId) return res.redirect('/dashboard');
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM usuarios WHERE username = ?', [username], (err, user) => {
        if (err || !user) return res.send('Usuario incorrecto. <a href="/login">Volver</a>');
        
        // Validar contraseña
        const validPass = bcrypt.compareSync(password, user.password);
        if (!validPass) return res.send('Contraseña incorrecta. <a href="/login">Volver</a>');

        // Autenticación exitosa
        req.session.userId = user.id;
        req.session.username = user.username;
        res.redirect('/dashboard');
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// ================= RUTAS DE ARCHIVOS =================

app.get('/dashboard', authMiddleware, fileController.getDashboard);
app.post('/upload', authMiddleware, upload.single('archivo'), fileController.uploadFile);
app.get('/delete/:id', authMiddleware, fileController.deleteFile);

// Ruta por defecto
// Ruta por defecto (Catch-all)
app.use((req, res) => res.redirect('/login'));

// ================= INICIAR SERVIDOR =================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n✅ Servidor corriendo con éxito en: http://localhost:${PORT}`);
    console.log(`🔑 Usuarios de prueba creados:`);
    console.log(`   - Usuario: usuario1 | Clave: user123`);
    console.log(`   - Usuario: usuario2 | Clave: user456\n`);
});
