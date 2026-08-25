-- V1: extension base para generar identificadores UUID (usados como PK publica
-- en las entidades de dominio para evitar la enumeracion de recursos por id secuencial).
CREATE EXTENSION IF NOT EXISTS pgcrypto;
