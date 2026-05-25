# Sistema de Gestión de Archivos por Usuario - Perfil Junior

Aplicación web desarrollada en Node.js que permite a los usuarios autenticados subir, visualizar, descargar y eliminar de forma segura únicamente sus propios archivos.

---

#Diagrama Entidad-Relación (E-R)

La base de datos SQLite consta de dos tablas con una relación de uno a muchos (1:N).

```mermaid
erDiagram
    USUARIOS ||--o{ ARCHIVOS : "posee"
    
    USUARIOS {
        INTEGER id PK "Autoincremental"
        TEXT username "Único"
        TEXT password "Hash encriptado"
    }
    
    ARCHIVOS {
        TEXT id PK "UUID"
        INTEGER usuario_id FK "Referencia a USUARIOS.id"
        TEXT nombre_original "Nombre original del archivo"
        TEXT ruta_servidor "Nombre físico almacenado"
    }```


Manual Técnico
Stack Tecnológico
Backend: Node.js con Express.js

Base de Datos: SQLite3 (Elegida por su portabilidad para pruebas sin configuración externa).

Vistas: EJS (Embedded JavaScript) y CSS3 puro.

Manejo de Archivos: Multer (multipart/form-data).

Seguridad: bcryptjs (Hash de contraseñas) y express-session.

Requisitos Previos
Node.js (v14 o superior)

npm (Node Package Manager)

Instrucciones de Instalación y Ejecución
Clonar el repositorio.

Instalar las dependencias del proyecto:
npm install
node server.js

Nota: La base de datos SQLite (database.sqlite) y las tablas se generarán automáticamente al arrancar el servidor por primera vez, al igual que los usuarios de prueba.

Acceder a la aplicación desde el navegador web en: http://localhost:3000

Manual de Usuario
1. Acceso al Sistema
Al iniciar la aplicación, será redirigido a la pantalla de Login. El sistema cuenta con dos usuarios preconfigurados para realizar las pruebas de aislamiento de datos:

Usuario 1: usuario1 | Contraseña: user123

Usuario 2: usuario2 | Contraseña: user456

Gestión de Archivos (Dashboard)
Una vez iniciada la sesión, el usuario visualizará su panel principal:

Subir Archivos: Utilice el botón "Examinar..." para seleccionar un archivo local y presione "Subir Archivo". El sistema lo renombrará internamente con un UUID para evitar colisiones, pero mantendrá el nombre original en la vista.

Visualizar y Descargar: La tabla inferior muestra estrictamente los archivos cargados por el usuario activo. Puede descargar el archivo original haciendo clic en el enlace "Descargar".

Eliminar: Al hacer clic en "Eliminar", se le pedirá confirmación. Esta acción borra el registro de la base de datos y el archivo físico del disco duro del servidor.

Cerrar Sesión: Finaliza la sesión actual de forma segura para permitir el ingreso de otro usuario.


