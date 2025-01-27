# Project: Notes Application

## **1. Installation and Configuration of PostgreSQL**

### **1.1. Installation**
- **Operating System:** Windows.
- **Steps performed:**
  1. Downloaded PostgreSQL from the [official website](https://www.postgresql.org/download/).
  2. Selected components during installation:
     - PostgreSQL Server.
     - pgAdmin 4.
     - Command Line Tools.
     - Stack Builder (optional).
  3. Set a password for the `postgres` user.

### **1.2. Configuration of pgAdmin**
- A new server was created in pgAdmin with the following details:
  - **Hostname/Address:** `localhost`
  - **Port:** `5432`
  - **Username:** `postgres`
  - **Password:** (password set during installation).
- Connection verified successfully.

### **1.3. Database Creation**
- Database name: `notes_app`.
- Optional SQL command used:
  ```sql
  CREATE DATABASE notes_app;
  ```

---

## **2. Data Model**

### **2.1. Created Tables**

#### **Notes**
Stores user notes.
```sql
CREATE TABLE Notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE: Active, FALSE: Archived
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Categories**
Stores categories to organize notes.
```sql
CREATE TABLE Categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);
```

#### **Notes_Categories**
Intermediate table to handle the many-to-many relationship between Notes and Categories.
```sql
CREATE TABLE Notes_Categories (
    note_id INT NOT NULL REFERENCES Notes(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES Categories(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, category_id)
);
```

### **2.2. Model Relationships**
- **Notes** has a 1:N relationship with **Notes_Categories**.
- **Categories** has a 1:N relationship with **Notes_Categories**.
- **Notes_Categories** represents the N:M relationship between the previous tables.

---

## **3. Backend Setup**

### **3.1. Node.js Setup**

1. Initialized the Node.js project:
   ```bash
   npm init -y
   ```

2. Installed the required dependencies:
   ```bash
   npm install express pg cors
   ```

### **3.2. Basic Server Configuration**
A basic server was created using Express:

```javascript
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

console.log('PostgreSQL pool ready');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('API is working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

### **3.3. API Endpoints**

#### **Notes Endpoints**

##### **Get All Notes**
Fetches all notes from the database, ordered by the most recently created or modified:
```javascript
app.get('/notes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Notes ORDER BY updated_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching notes', error);
    res.status(500).send('Error fetching notes');
  }
});
```

##### **Create a New Note**
Adds a new note to the database:
```javascript
app.post('/notes', async (req, res) => {
  const { title, content, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Notes (title, content, status) VALUES ($1, $2, $3) RETURNING *',
      [title, content, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating note', error);
    res.status(500).send('Error creating note');
  }
});
```

##### **Update a Note**
Updates an existing note by ID:
```javascript
app.put('/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Notes SET title = $1, content = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title, content, status, id]
    );
    if (result.rows.length === 0) {
      res.status(404).send('Note not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating note', error);
    res.status(500).send('Error updating note');
  }
});
```

##### **Delete a Note**
Deletes a note by ID:
```javascript
app.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Notes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Note not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error deleting note', error);
    res.status(500).send('Error deleting note');
  }
});
```

#### **Categories Endpoints**

##### **Get All Categories**
Fetches all categories from the database:
```javascript
router.get('/', categoriesController.getAllCategories);
```

##### **Create a New Category**
Adds a new category to the database:
```javascript
router.post('/', categoriesController.createCategory);
```

##### **Get Notes by Category**
Fetches all notes linked to a specific category:
```javascript
router.get('/:categoryId/notes', categoriesController.getNotesByCategory);
```

##### **Assign a Category to a Note**
Associates a category with a specific note:
```javascript
router.post('/notes/:id/categories', categoriesController.assignCategoryToNote);
```

---

## **4. Frontend Implementation**

### **4.1. Overview**
- Built a simple web interface using HTML, CSS, and JavaScript to interact with the API.
- Functionalities include:
  - Viewing all notes.
  - Creating a new note.
  - Editing an existing note.
  - Deleting a note.
  - Filtering notes by category.

### **4.2. Features**
1. **Display Notes:** Automatically fetches and displays all notes when the page loads.
2. **Add Note:** Allows users to add a new note. After submission, the form resets.
3. **Edit Note:** Updates a specific note by populating the form with the selected note's details.
4. **Delete Note:** Deletes a note and provides a success message.
5. **Filter by Category:** Filters the notes displayed based on the selected category.
6. **Dynamic Updates:** The table refreshes dynamically after each action without needing to reload the page.

---

## **5. Process Summary**

### **5.1. Steps Completed**
- Installed and configured PostgreSQL and pgAdmin.
- Created the database `notes_app` and tables `Notes`, `Categories`, and `Notes_Categories`.
- Set up a Node.js backend with Express.
- Connected the backend to PostgreSQL and implemented CRUD operations for notes and categories.
- Built a functional frontend to interact with the API.
- Successfully tested all features.

---

## **6. Testing Implementation**

### **6.1. Tools Used**
- **Jest:** For unit and integration testing.
- **Supertest:** For testing HTTP requests against the API.

### **6.2. Test Coverage**
The following scenarios are tested:
1. **Fetch all notes:** Ensures that the API returns a list of notes.
2. **Create a new note:** Verifies that a new note can be added successfully.
3. **Update a note:** Confirms that an existing note can be updated.
4. **Delete a note:** Checks that a note can be deleted and returns the correct response.
5. **Fetch categories:** Ensures that the API returns all categories.
6. **Create a category:** Verifies that a new category can be created successfully.
7. **Filter notes by category:** Ensures that notes are filtered correctly by category.

### **6.3. Running Tests**
To execute the tests, run the following command:
```bash
npm test
```
This will execute all the tests and provide a detailed summary of the results.

---

## **7. How to Run the Project**

1. **Backend:**
   - Navigate to the backend folder.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the server:
     ```bash
     npm start
     ```

2. **Frontend:**
   - Open the `index.html` file in your browser using Live Server or similar tools.

---

## **8. Tools Used**
- **PostgreSQL 17.2-3**
- **pgAdmin 4**
- **Node.js**
- **Express**
- **pg (PostgreSQL Client)**
- **Jest**
- **Supertest**
- **HTML, CSS, JavaScript**

