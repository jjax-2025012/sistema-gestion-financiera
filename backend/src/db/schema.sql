-- Esquema inicial del Sistema Web de Gestión y Control Financiero.
-- Incremento 1: SOLO la tabla necesaria para el login.
-- Las tablas de ingresos, gastos, activos, pasivos, ahorro, presupuestos,
-- espacios financieros, etc. se agregarán en incrementos posteriores.

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índice para acelerar la búsqueda por correo, que es como se inicia sesión.
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

