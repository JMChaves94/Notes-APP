const apiUrl = "http://localhost:3000";
let editingNoteId = null;

// Fetch and display notes
async function fetchNotes(categoryId = null) {
  const url = categoryId ? `${apiUrl}/notes?categoryId=${categoryId}` : `${apiUrl}/notes`;
  const response = await fetch(url);
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
}

// Fetch and populate categories in dropdown
async function fetchCategories() {
  const response = await fetch(`${apiUrl}/categories`);
  const categories = await response.json();

  // Populate categoryDropdown for adding/editing notes
  const categoryDropdown = document.getElementById("categoryDropdown");
  categoryDropdown.innerHTML = '<option value="">Select Category</option>';

  // Populate filterCategoryDropdown for filtering notes
  const filterDropdown = document.getElementById("filterCategoryDropdown");
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

  if (!title || !content) {
    showErrorMessage("Title and content cannot be empty!");
    return;
  }

  const noteData = { title, content, status, categoryId: categoryId || null };

  let response;
  if (editingNoteId !== null) {
    // Edit note
    response = await fetch(`${apiUrl}/notes/${editingNoteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData),
    });
    editingNoteId = null;
  } else {
    // Add new note
    response = await fetch(`${apiUrl}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  const response = await fetch(`${apiUrl}/notes/${id}`, { method: "DELETE" });
  if (response.ok) {
    showSuccessMessage("Note deleted successfully!");
    await fetchNotes();
  } else {
    showErrorMessage("Failed to delete note.");
  }
}

// Edit a note
function editNote(id, title, content, status, categoryId) {
  editingNoteId = id;
  document.querySelector("#title").value = title;
  document.querySelector("#content").value = content;
  document.querySelector("#status").value = status.toString();
  document.querySelector("#categoryDropdown").value = categoryId || "";
}

// Display a success message
function showSuccessMessage(message) {
  const successMessageDiv = document.querySelector("#success-message");
  successMessageDiv.innerText = message;
  successMessageDiv.style.display = "block";
  setTimeout(() => successMessageDiv.style.display = "none", 3000);
}

// Display an error message
function showErrorMessage(message) {
  const errorMessageDiv = document.querySelector("#error-message");
  errorMessageDiv.innerText = message;
  errorMessageDiv.style.display = "block";
  setTimeout(() => errorMessageDiv.style.display = "none", 3000);
}

// Initialize app
(async () => {
  await fetchCategories();
  await fetchNotes();
})();
