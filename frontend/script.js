const apiUrl = "http://localhost:3000";
let editingNoteId = null;

// Authenticate user
async function login(email, password) {
  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem("authToken", token); // Save token in local storage
      showSuccessMessage("Login successful!");
      document.getElementById("login-container").style.display = "none";
      document.getElementById("form-container").style.display = "block";
      document.getElementById("notes-container").style.display = "block";
      await fetchCategories();
      await fetchNotes();
    } else {
      const error = await response.json();
      showErrorMessage(error.message || "Login failed.");
    }
  } catch (error) {
    showErrorMessage("An error occurred during login.");
  }
}

// Fetch and display notes
async function fetchNotes(categoryId = null) {
  const url = categoryId ? `${apiUrl}/notes?categoryId=${categoryId}` : `${apiUrl}/notes`;
  const token = localStorage.getItem("authToken");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    const notes = await response.json();
    const tableBody = document.querySelector("#notes-table tbody");
    tableBody.innerHTML = "";

    notes.forEach(note => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${note.title}</td>
        <td>${note.content}</td>
        <td>${note.status ? "Active" : "Archived"}</td>
        <td>${note.category_name || "Uncategorized"}</td>
        <td>
          <button class="edit" onclick="editNote(${note.id}, '${note.title}', '${note.content}', ${note.status}, '${note.category_id || ""}')">Edit</button>
          <button class="delete" onclick="deleteNote(${note.id})">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  } else {
    showErrorMessage("Failed to fetch notes.");
  }
}

// Fetch and populate categories in dropdown
async function fetchCategories() {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${apiUrl}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    const categories = await response.json();
    const categoryDropdown = document.getElementById("categoryDropdown");
    const filterDropdown = document.getElementById("filterCategoryDropdown");

    categoryDropdown.innerHTML = '<option value="">Select Category</option>';
    filterDropdown.innerHTML = '<option value="">All Categories</option>';

    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categoryDropdown.appendChild(option);

      const filterOption = document.createElement("option");
      filterOption.value = category.id;
      filterOption.textContent = category.name;
      filterDropdown.appendChild(filterOption);
    });
  } else {
    showErrorMessage("Failed to fetch categories.");
  }
}

// Filter notes by category
document.getElementById("filterCategoryDropdown").addEventListener("change", async (e) => {
  const categoryId = e.target.value;
  await fetchNotes(categoryId || null);
});

// Add or save a note
document.querySelector("#note-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.querySelector("#title").value.trim();
  const content = document.querySelector("#content").value.trim();
  const status = document.querySelector("#status").value === "true";
  const categoryId = document.querySelector("#categoryDropdown").value;
  const token = localStorage.getItem("authToken");

  if (!title || !content) {
    showErrorMessage("Title and content cannot be empty!");
    return;
  }

  const noteData = { title, content, status, categoryId: categoryId || null };
  let response;

  if (editingNoteId !== null) {
    response = await fetch(`${apiUrl}/notes/${editingNoteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    });
    editingNoteId = null;
  } else {
    response = await fetch(`${apiUrl}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    });
  }

  if (response.ok) {
    showSuccessMessage("Note saved successfully!");
    document.querySelector("#note-form").reset();
    await fetchNotes();
  } else {
    showErrorMessage("Failed to save note.");
  }
});

// Delete a note
async function deleteNote(id) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${apiUrl}/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    showSuccessMessage("Note deleted successfully!");
    await fetchNotes();
  } else {
    showErrorMessage("Failed to delete note.");
  }
}

// Handle login form submission
document.querySelector("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#login-email").value.trim();
  const password = document.querySelector("#login-password").value.trim();
  await login(email, password);
});

// Display success message
function showSuccessMessage(message) {
  const successMessageDiv = document.querySelector("#success-message");
  successMessageDiv.innerText = message;
  successMessageDiv.style.display = "block";
  setTimeout(() => successMessageDiv.style.display = "none", 3000);
}

// Display error message
function showErrorMessage(message) {
  const errorMessageDiv = document.querySelector("#error-message");
  errorMessageDiv.innerText = message;
  errorMessageDiv.style.display = "block";
  setTimeout(() => errorMessageDiv.style.display = "none", 3000);
}


function editNote(id, title, content, status, categoryId) {
  editingNoteId = id; // Establecer el ID de la nota que se va a editar
  document.querySelector("#title").value = title;
  document.querySelector("#content").value = content;
  document.querySelector("#status").value = status ? "true" : "false";
  document.querySelector("#categoryDropdown").value = categoryId || ""; 
  document.querySelector("#submit-button").textContent = "Update Note"; 
}
