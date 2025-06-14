-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS auth_system;
USE auth_system;

-- Crear tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario administrador inicial
-- Contraseña: admin123 (hasheada con bcrypt)
INSERT INTO users (name, email, password, role) 
VALUES (
    'Admin', 
    'admin@example.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
    'admin'
);