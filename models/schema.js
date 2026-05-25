const db = require('../config/database');
const bcrypt = require('bcryptjs');

function initDatabase() {
    db.serialize(() => {
        // Tabla usuario y archivos
        db.run(`CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS archivos (
            id TEXT PRIMARY KEY,
            usuario_id INTEGER,
            nombre_original TEXT,
            ruta_servidor TEXT,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )`);

        // se ingresan los 2 usuarios requeridos.
        const salt = bcrypt.genSaltSync(10);
        // Contraseñas encriptadas por seguridad
        const passHash1 = bcrypt.hashSync('user123', salt);
        const passHash2 = bcrypt.hashSync('user456', salt);

        // Usamos INSERT OR IGNORE para que duplicaciones si reinicia el servidor
        db.run(`INSERT OR IGNORE INTO usuarios (username, password) VALUES ('usuario1', '${passHash1}')`);
        db.run(`INSERT OR IGNORE INTO usuarios (username, password) VALUES ('usuario2', '${passHash2}')`);
    });
}

module.exports = initDatabase;
