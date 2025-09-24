-- SICAU - Sistema de Reservas Universitarias
-- Script SQL para MySQL - Base de datos: kkjs_bd
-- Ejecutar este script en phpMyAdmin para crear todas las tablas

-- Crear base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS kkjs_bd;
USE kkjs_bd;

-- Tabla de departamentos académicos
CREATE TABLE IF NOT EXISTS departamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    icono VARCHAR(50) NOT NULL,
    descripcion TEXT,
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de espacios (aulas, laboratorios, comunes)
CREATE TABLE IF NOT EXISTS espacios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    departamento_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('aula', 'laboratorio', 'comun') NOT NULL,
    capacidad INT NOT NULL,
    descripcion TEXT,
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE CASCADE
);

-- Tabla de usuarios (estudiantes, profesores, administradores)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    codigo_estudiante VARCHAR(20),
    tipo ENUM('estudiante', 'profesor', 'administrador') NOT NULL,
    departamento VARCHAR(100),
    contrasena VARCHAR(255) NOT NULL,
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    espacio_id INT NOT NULL,
    usuario_id INT,
    departamento_codigo VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    horario VARCHAR(50) NOT NULL,
    estado ENUM('activa', 'cancelada', 'completada') DEFAULT 'activa',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (espacio_id) REFERENCES espacios(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de solicitudes especiales (para profesores)
CREATE TABLE IF NOT EXISTS solicitudes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo ENUM('equipo', 'mantenimiento', 'accesibilidad', 'otro') NOT NULL,
    descripcion TEXT NOT NULL,
    urgencia ENUM('baja', 'media', 'alta') DEFAULT 'media',
    estado ENUM('pendiente', 'en_revision', 'aprobada', 'rechazada') DEFAULT 'pendiente',
    respuesta_admin TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_reservas_fecha ON reservas(fecha);
CREATE INDEX idx_reservas_espacio ON reservas(espacio_id);
CREATE INDEX idx_reservas_usuario ON reservas(usuario_id);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_espacios_departamento ON espacios(departamento_id);
CREATE INDEX idx_espacios_tipo ON espacios(tipo);
CREATE INDEX idx_solicitudes_usuario ON solicitudes(usuario_id);
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado);

-- Insertar departamentos académicos
INSERT INTO departamentos (codigo, nombre, icono, descripcion) VALUES
('diseno', 'Diseño', 'fas fa-palette', 'Talleres de diseño gráfico y digital'),
('electrica', 'Eléctrica', 'fas fa-bolt', 'Laboratorios de circuitos y electrónica'),
('mecanica', 'Mecánica', 'fas fa-cog', 'Talleres de mecánica y maquinaria'),
('produccion', 'Producción', 'fas fa-industry', 'Instalaciones de producción industrial'),
('sistemas-digitales', 'Sistemas Digitales', 'fas fa-microchip', 'Laboratorios de sistemas embebidos'),
('deportivos', 'Deportivos', 'fas fa-futbol', 'Instalaciones deportivas y gimnasios')
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    icono = VALUES(icono),
    descripcion = VALUES(descripcion);

-- Insertar espacios de ejemplo
INSERT INTO espacios (departamento_id, nombre, tipo, capacidad, descripcion) VALUES
-- Diseño
(1, 'Taller de Diseño Gráfico 1', 'laboratorio', 20, 'Equipado con computadoras Mac y software Adobe'),
(1, 'Taller de Diseño Gráfico 2', 'laboratorio', 20, 'Especializado en diseño digital y multimedia'),
(1, 'Aula de Diseño A', 'aula', 35, 'Aula teórica con proyector HD'),
(1, 'Aula de Diseño B', 'aula', 30, 'Aula práctica con mesas de dibujo'),

-- Eléctrica
(2, 'Laboratorio de Circuitos 1', 'laboratorio', 25, 'Equipos de medición y protoboards'),
(2, 'Laboratorio de Circuitos 2', 'laboratorio', 25, 'Analizadores de espectro y osciloscopios'),
(2, 'Aula de Eléctrica A', 'aula', 40, 'Aula magistral con equipo audiovisual'),
(2, 'Aula de Eléctrica B', 'aula', 35, 'Aula práctica con bancos de trabajo'),

-- Mecánica
(3, 'Taller de Mecánica 1', 'laboratorio', 20, 'Tornos y fresadoras industriales'),
(3, 'Taller de Mecánica 2', 'laboratorio', 20, 'Equipos de soldadura y metrología'),
(3, 'Aula de Mecánica A', 'aula', 40, 'Aula teórica con proyector'),
(3, 'Aula de Mecánica B', 'aula', 35, 'Aula práctica con modelos didácticos'),

-- Producción
(4, 'Laboratorio de Producción 1', 'laboratorio', 25, 'Software CAD/CAM y CNC'),
(4, 'Laboratorio de Producción 2', 'laboratorio', 25, 'Equipos de control numérico'),
(4, 'Aula de Producción A', 'aula', 40, 'Aula teórica con equipo multimedia'),
(4, 'Aula de Producción B', 'aula', 35, 'Aula práctica con estaciones de trabajo'),

-- Sistemas Digitales
(5, 'Laboratorio de Sistemas 1', 'laboratorio', 25, 'Microcontroladores y FPGA'),
(5, 'Laboratorio de Sistemas 2', 'laboratorio', 25, 'Sistemas embebidos y IoT'),
(5, 'Aula de Sistemas A', 'aula', 40, 'Aula magistral con pantallas interactivas'),
(5, 'Aula de Sistemas B', 'aula', 35, 'Aula práctica con kits de desarrollo'),

-- Deportivos
(6, 'Gimnasio Principal', 'comun', 50, 'Equipos cardiovasculares y de fuerza'),
(6, 'Cancha de Fútbol', 'comun', 22, 'Cancha sintética con iluminación'),
(6, 'Cancha de Básquetbol', 'comun', 10, 'Cancha techada con tableros electrónicos'),
(6, 'Sala de Aeróbicos', 'comun', 30, 'Espacio para clases grupales')
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    tipo = VALUES(tipo),
    capacidad = VALUES(capacidad),
    descripcion = VALUES(descripcion);

-- Insertar usuarios de ejemplo
INSERT INTO usuarios (nombre, email, telefono, codigo_estudiante, tipo, departamento, contrasena) VALUES
('Katheryn Suarez Garcia', 'katheryn.suarez@universidad.edu', '3001234567', 'EST2024001', 'estudiante', 'Diseño', '1025649206'),
('Carlos Rodríguez', 'carlos.rodriguez@universidad.edu', '3002345678', 'EST2024002', 'estudiante', 'Eléctrica', 'password123'),
('María López', 'maria.lopez@universidad.edu', '3003456789', 'EST2024003', 'estudiante', 'Mecánica', 'password123'),
('Prof. Juan Martínez', 'juan.martinez@universidad.edu', '3004567890', 'PROF001', 'profesor', 'Sistemas Digitales', 'password123'),
('Prof. Laura Hernández', 'laura.hernandez@universidad.edu', '3005678901', 'PROF002', 'profesor', 'Producción', 'password123'),
('Admin Sistema', 'admin@kkjs.edu', '3006789012', 'ADMIN001', 'administrador', 'Administración', 'admin123')
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    email = VALUES(email),
    telefono = VALUES(telefono),
    contrasena = VALUES(contrasena);

-- Insertar reservas de ejemplo
INSERT INTO reservas (espacio_id, usuario_id, departamento_codigo, fecha, horario, estado) VALUES
(1, 1, 'diseno', '2024-12-01', '08:00-10:00', 'activa'),
(5, 2, 'electrica', '2024-12-02', '14:00-16:00', 'activa'),
(9, 3, 'mecanica', '2024-12-03', '10:00-12:00', 'activa'),
(13, 4, 'produccion', '2024-12-04', '16:00-18:00', 'activa'),
(17, 5, 'sistemas-digitales', '2024-12-05', '08:00-10:00', 'activa'),
(21, 6, 'deportivos', '2024-12-06', '14:00-16:00', 'activa')
ON DUPLICATE KEY UPDATE
    fecha = VALUES(fecha),
    horario = VALUES(horario),
    estado = VALUES(estado);

-- Mostrar información de las tablas creadas
SELECT 'Tablas creadas exitosamente' as mensaje;
SELECT 'Departamentos' as tabla, COUNT(*) as registros FROM departamentos;
SELECT 'Espacios' as tabla, COUNT(*) as registros FROM espacios;
SELECT 'Usuarios' as tabla, COUNT(*) as registros FROM usuarios;
SELECT 'Reservas' as tabla, COUNT(*) as registros FROM reservas;
SELECT 'Solicitudes' as tabla, COUNT(*) as registros FROM solicitudes;
