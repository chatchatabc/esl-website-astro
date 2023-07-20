-- Columns: id, username, password, phone, email, firstName, lastName, role, createdAt, updatedAt
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT NOT NULL, password TEXT NOT NULL, phone TEXT, email TEXT, firstName TEXT, lastName TEXT, createdAt INTEGER NOT NULL, updatedAt INTEGER NOT NULL, role INTEGER NOT NULL);
INSERT INTO users (username, password, createdAt, updatedAt, role) VALUES ('admin', 'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3', 0, 0, 1), ('student', 'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3', 0, 0, 2), ('teacher', 'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3', 0, 0, 3);

DROP TABLE IF EXISTS roles;
CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY, name TEXT, createdAt INTEGER NOT NULL, updatedAt INTEGER NOT NULL);
INSERT INTO roles (name, createdAt, updatedAt) VALUES ('admin', 0, 0), ('student', 0, 0), ('teacher', 0, 0);

-- Columns: id, teacherId, userId, startDate, endDate, status, createdAt, updatedAt
DROP TABLE IF EXISTS schedules;
CREATE TABLE IF NOT EXISTS schedules (id INTEGER PRIMARY KEY, teacherId INTEGER NOT NULL, startDate INTEGER NOT NULL, endDate INTEGER NOT NULL, studentId INTEGER, status INTEGER NOT NULL, createdAt INTEGER NOT NULL, updatedAt INTEGER NOT NULL);
INSERT INTO schedules (teacherId, studentId, status, createdAt, updatedAt, startDate, endDate) VALUES (3, 2, 0, 0, 0, 1689840543000, 1689851343000);
