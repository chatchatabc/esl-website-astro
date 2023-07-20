-- Columns: id, username, password, phone, email, firstName, lastName, role, createdAt, updatedAt
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT NOT NULL, password TEXT NOT NULL, phone TEXT, email TEXT, firstName TEXT, lastName TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL, role INTEGER NOT NULL);
INSERT INTO users (username, password, createdAt, updatedAt, role) VALUES ('admin', 'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3', '2019-01-01 00:00:00', '2019-01-01 00:00:00', 1);

DROP TABLE IF EXISTS roles;
CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY, name TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL);
INSERT INTO roles (name, createdAt, updatedAt) VALUES ('student', '2019-01-01 00:00:00', '2019-01-01 00:00:00'), ('teacher', '2019-01-01 00:00:00', '2019-01-01 00:00:00');

-- Columns: id, teacherId, userId, startDate, endDate, status, createdAt, updatedAt
DROP TABLE IF EXISTS schedules;
CREATE TABLE IF NOT EXISTS schedules (id INTEGER PRIMARY KEY, teacherId INTEGER NOT NULL, startDate TEXT NOT NULL, endDate TEXT NOT NULL, userId INTEGER, status INTEGER NOT NULL, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL);
INSERT INTO schedules (teacherId, userId, status, createdAt, updatedAt, startDate, endDate) VALUES (2, 1, 0, '2019-01-01 00:00:00', '2019-01-01 00:00:00', '2019-01-01 00:00:00', '2019-01-01 00:00:00');
