Notes Application
1. Installation and Configuration of PostgreSQL
1.1. Installation
Operating System: Windows.
Steps performed:
Downloaded PostgreSQL from the official website.
Selected components during installation:
PostgreSQL Server.
pgAdmin 4.
Command Line Tools.
Stack Builder (optional).
Set a password for the postgres user.
1.2. Configuration of pgAdmin
A new server was created in pgAdmin with the following details:
Hostname/Address: localhost.
Port: 5432.
Username: postgres.
Password: (password set during installation).
Connection verified successfully.
1.3. Database Creation
Database name: notes_app.
SQL command used:
sql
Copiar
CREATE DATABASE notes_app;
2. Data Model
2.1. Created Tables
Notes Table
Stores user notes.

sql
Copiar
CREATE TABLE Notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    category_id INT DEFAULT NULL REFERENCES Categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Categories Table
Stores categories to organize notes.

sql
Copiar
CREATE TABLE Categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);
Users Table
Stores user credentials for authentication.

sql
Copiar
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
2.2. Model Relationships
Notes has an optional foreign key category_id linked to the Categories table.
Categories can have many Notes associated with it.
Users are associated with the login functionality to secure the application.
2.3. Seed Data
Initial data is inserted into the tables for testing purposes:
Categories: Work, Personal, Urgent.
Users: test@example.com (password: 12345678, hashed).
3. Backend Setup
3.1. Node.js Setup
Initialized the Node.js project:
bash
Copiar
npm init -y
Installed the required dependencies:
bash
Copiar
npm install express pg cors dotenv morgan bcrypt jsonwebtoken jest supertest
3.2. Basic Server Configuration
A basic server was created using Express:

javascript
Copiar
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'notes_app',
  password: 'your_password',
  port: 5432,
});

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
3.3. Authentication Setup
Password Hashing: Passwords are hashed using bcrypt before saving them in the database.
Token Generation: A JWT token is generated upon successful login.
Middleware for Protected Routes: Authenticated routes use middleware to verify the token.
4. API Endpoints
4.1. Notes Endpoints
Get All Notes: GET /notes
Create a New Note: POST /notes
Update a Note: PUT /notes/:id
Delete a Note: DELETE /notes/:id
Filter Notes by Category: GET /notes?categoryId=ID
4.2. Categories Endpoints
Get All Categories: GET /categories
Create a New Category: POST /categories
4.3. Authentication Endpoints
Register User: POST /auth/register
Login User: POST /auth/login
5. Frontend Implementation
5.1. Overview
Built a web interface using HTML, CSS, and JavaScript.
Functionalities include:
Viewing all notes.
Creating, editing, and deleting notes.
Filtering notes by category.
User login functionality.
5.2. Features
Display Notes: Automatically fetches and displays notes on login.
Add Note: Adds a new note and refreshes the table dynamically.
Edit Note: Allows inline editing of an existing note.
Delete Note: Deletes a note and updates the UI.
Filter by Category: Filters notes based on category selection.
5.3. Security Features
JWT Authentication: All note-related requests are authenticated using JWT.
Frontend Token Handling: Token is stored in localStorage and included in all requests.
6. Testing Implementation
6.1. Tools Used
Jest: For unit and integration testing.
Supertest: For testing API endpoints.
6.2. Test Coverage
The following scenarios are tested:

Fetch all notes.
Create a new note.
Update a note.
Delete a note.
Fetch categories.
Create a category.
Login and authentication flow.
6.3. Running Tests
To execute the tests, run:

bash
Copiar
npm test
7. How to Run the Project
Backend:
Navigate to the backend folder.
Install dependencies:
bash
Copiar
npm install
Start the server:
bash
Copiar
npm start
Frontend:
Navigate to the frontend folder.
Open index.html in your browser using Live Server or a similar tool.
Database Initialization:
To initialize the database, run the setup.bat script on Windows:

bash
Copiar
setup.bat
This script will:

Create or reset the database schema.
Seed the database with initial data (categories and a test user).
8. Tools and Technologies Used
Database: PostgreSQL
Backend: Node.js, Express
Frontend: HTML, CSS, JavaScript
Authentication: bcrypt, JWT
Testing: Jest, Supertest
Other Tools: pgAdmin, Live Server
9. Batch Script Details
Updated Windows Batch Script (setup.bat):
This script does the following:

Checks if PostgreSQL is installed and accessible at the configured path.
Ensures the notes_app database exists, creating it if necessary.
Runs the schema file to set up tables.
Seeds the database with initial data.
Navigates to the backend and starts the server.
Opens Visual Studio Code in the frontend directory.
Displays a message instructing the user to click "Go Live" in Visual Studio Code to launch the frontend.
10. Functional and Non-Functional Requirements
Functional Requirements:
Ability to create, edit, delete, and archive notes.
Filtering notes by categories.
User authentication and authorization.
Persistent data storage in PostgreSQL.
Functional setup script that initializes the database and backend.
Non-Functional Requirements:
Visual Studio Code should be installed.
PostgreSQL should be accessible at the specified installation path.
Clear and straightforward instructions for running the project.
Reliable error handling for missing or misconfigured dependencies.