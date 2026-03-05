-- MediReport Pro V3 - Database Schema for InForge (MySQL)

CREATE DATABASE IF NOT EXISTS medireport_v3 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE medireport_v3;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('administrador', 'coordinador', 'doctor', 'enfermero') NOT NULL,
    avatar VARCHAR(10),
    specialty VARCHAR(100),
    center VARCHAR(150),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    data JSON NOT NULL,
    created_by_user_id VARCHAR(50),
    created_by_name VARCHAR(100),
    center VARCHAR(150),
    status ENUM('pendiente', 'completado', 'revisado') DEFAULT 'completado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200),
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'urgent') DEFAULT 'info',
    created_by VARCHAR(50),
    target_roles JSON, -- List of roles that should see this
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Audit Log Table (for synchronization tracking)
CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id VARCHAR(50),
    performed_by VARCHAR(50),
    details JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Backup Log
CREATE TABLE IF NOT EXISTS backups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    size_bytes BIGINT,
    hash VARCHAR(64),
    status ENUM('success', 'failed') DEFAULT 'success',
    remote_sync_status ENUM('pending', 'synced') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Admin Seed
INSERT INTO users (id, name, email, password, role, avatar, specialty, center, phone) 
VALUES ('u1', 'Admin del Sistema', 'admin@mariño.gob.ve', 'admin123', 'administrador', '👤', 'Administración', 'Alcaldía Santiago Mariño', '+58 412-1234567')
ON DUPLICATE KEY UPDATE name=name;
