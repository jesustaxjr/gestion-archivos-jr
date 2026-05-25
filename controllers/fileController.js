const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// 1. Mostrar el Dashboard con los archivos del usuario
exports.getDashboard = (req, res) => {
    db.all('SELECT * FROM archivos WHERE usuario_id = ?', [req.session.userId], (err, rows) => {
        if (err) return res.status(500).send('Error al consultar la base de datos');
        res.render('dashboard', { usuario: req.session.username, archivos: rows });
    });
};

// 2. Subir un nuevo archivo
exports.uploadFile = (req, res) => {
    if (!req.file) return res.status(400).send('No se seleccionó ningún archivo');

    // Multer ya guardó el archivo con un UUID + extensión. Usamos el UUID como ID en la base de datos.
    const idUnico = path.basename(req.file.filename, path.extname(req.file.filename));
    const query = `INSERT INTO archivos (id, usuario_id, nombre_original, ruta_servidor) VALUES (?, ?, ?, ?)`;
    
    db.run(query, [idUnico, req.session.userId, req.file.originalname, req.file.filename], (err) => {
        if (err) return res.status(500).send('Error al registrar el archivo en la base de datos');
        res.redirect('/dashboard');
    });
};

// 3. Eliminar un archivo
exports.deleteFile = (req, res) => {
    const fileId = req.params.id;

    // Buscamos el archivo ASEGURANDO que le pertenezca al usuario en sesión
    db.get('SELECT * FROM archivos WHERE id = ? AND usuario_id = ?', [fileId, req.session.userId], (err, row) => {
        if (err || !row) return res.status(403).send('Acceso denegado: El archivo no existe o no te pertenece.');

        // 3.1 Borrar el archivo físico del disco duro
        const filePath = path.join(__dirname, '../public/uploads/', row.ruta_servidor);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // 3.2 Borrar el registro de la base de datos
        db.run('DELETE FROM archivos WHERE id = ?', [fileId], (err) => {
            if (err) return res.status(500).send('Error al eliminar el registro');
            res.redirect('/dashboard');
        });
    });
};
