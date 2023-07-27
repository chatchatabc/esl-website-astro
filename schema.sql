/**
* id (integer)
* username (text)
* password (text)
* phone (text?)
* email (text?)
* firstName (text?)
* lastName (text?)
* roleId (integer)
* credit (integer)
* createdAt (timestamp)
* updatedAt (timestamp)
*/
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT NOT NULL, password TEXT NOT NULL, phone TEXT, email TEXT, firstName TEXT, lastName TEXT, createdAt INTEGER NOT NULL, updatedAt INTEGER NOT NULL, roleId INTEGER NOT NULL, credit INTEGER NOT NULL);
INSERT INTO users (username, password, roleId, credit, createdAt, updatedAt) VALUES ('admin', 'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3', 1, 1000, 0, 0), ('student', 'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3', 2, 1000, 0, 0), ('teacher', 'd7cd68b6014e62d355e294a622fe95894f047ba5dfd8cc06f98122cc2bb945d3', 3, 1000, 0, 0);

/**
* id (integer)
* userId (integer)
* price (integer)
* interval (timestampTimeOnly)
* createdAt (timestamp)
* updatedAt (timestamp)
*/
DROP TABLE IF EXISTS teachers;
CREATE TABLE IF NOT EXISTS teachers (id INTEGER PRIMARY KEY, userId INTEGER UNIQUE, price INTEGER NOT NULL, interval INTEGER NOT NULL, createdAt INTEGER NOT NULL, updatedAt INTEGER NOT NULL);
INSERT INTO teachers (userId, price, interval, createdAt, updatedAt) VALUES (3, 50, 25, 0, 0);


/**
* id (integer)
* name (text)
* createdAt (timestamp)
* updatedAt (timestamp)
*/
DROP TABLE IF EXISTS roles;
CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY, name TEXT, createdAt INTEGER NOT NULL, updatedAt INTEGER NOT NULL);
INSERT INTO roles (name, createdAt, updatedAt) VALUES ('admin', 0, 0), ('student', 0, 0), ('teacher', 0, 0);

/**
* id (integer)
* teacherId (integer)
* startTime (timestampTimeOnly)
* endTime (timestampTimeOnly)
* day (integer)
* createdAt (timestamp)
* updatedAt (timestamp)
*/
DROP TABLE IF EXISTS schedules;
CREATE TABLE IF NOT EXISTS schedules (id INTEGER PRIMARY KEY, teacherId INTEGER NOT NULL, startTime INTEGER NOT NULL, endTime INTEGER NOT NULL, day INTEGER NOT NULL, createdAt INTEGER NOT NULL, updatedAt INTEGER NOT NULL);
INSERT INTO schedules (teacherId, day, createdAt, updatedAt, startTime, endTime) VALUES (3, 0, 0, 0, -28800000, -10800000);

/**
* id (integer)
* teacherId (integer)
* studentId (integer)
* start (timestamp)
* end (timestamp)
* status (integer)
* message (text)
* createdAt (timestamp)
* updatedAt (timestamp)
*/
DROP TABLE IF EXISTS bookings;
CREATE TABLE IF NOT EXISTS bookings (id INTEGER PRIMARY KEY, teacherId INTEGER NOT NULL, studentId INTEGER, start INTEGER NOT NULL, end INTEGER NOT NULL, status INTEGER NOT NULL, message TEXT, createdAt INTEGER NOT NULL, updatedAt INTEGER NOT NULL);
INSERT INTO bookings (teacherId, studentId, status, createdAt, updatedAt, start, end) VALUES (3, 2, 0, 0, 0, 1689840543000, 1689851343000);
