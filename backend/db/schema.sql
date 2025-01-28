-- Crear tabla de categorías si no existe
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Crear tabla de notas si no existe
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE: Activa, FALSE: Archivada
    category_id INT DEFAULT NULL REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar categorías iniciales (si no existen)
INSERT INTO categories (name) VALUES
('Personal'),
('Work'),
('Important')
ON CONFLICT DO NOTHING;

-- Insertar usuario inicial (si no existe)
INSERT INTO users (username, email, hashed_password)
VALUES
('testuser', 'test@example.com', '$2b$10$j2OcWmJvl3aIDjH3w7KjQOT0iz90rC0BwRRszovv0Rr5yHCyyIXeu') -- Contraseña: 12345678
ON CONFLICT DO NOTHING;
