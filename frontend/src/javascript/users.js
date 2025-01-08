const token = localStorage.getItem('access_token');
if (!token) {
  window.location.href = 'login.html';
}

// Load all users
const loadUsers = async () => {
  const response = await fetch('http://localhost:3333/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const users = await response.json();
  const tableBody = document.getElementById('users-table');
  tableBody.innerHTML = '';

  users.forEach((user) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button class="btn btn-warning btn-sm edit-user-btn" data-id="${user.id}">Edit</button>
        <button class="btn btn-danger btn-sm delete-user-btn" data-id="${user.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  document.querySelectorAll('.edit-user-btn').forEach((btn) =>
    btn.addEventListener('click', handleEditUser)
  );
  document.querySelectorAll('.delete-user-btn').forEach((btn) =>
    btn.addEventListener('click', handleDeleteUser)
  );
};

// Add a new user
document.getElementById('add-user-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;
  const role = document.getElementById('user-role').value;
  try {
    await fetch('http://localhost:3333/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password, role }),
    });
    loadUsers();
  } catch (err) {
    alert('Error adding user');
  }
});

// Edit a user
const handleEditUser = async (e) => {
  const userId = e.target.getAttribute('data-id');
  
  // Get current user data
  const user = await fetch(`http://localhost:3333/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json());

  // Pre-fill modal fields
  document.getElementById('edit-email').value = user.email;
  document.getElementById('edit-role').value = user.role;

  // Open modal
  const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
  modal.show();

  // Attach update action
  document.getElementById('update-user-btn').onclick = async () => {
    const email = document.getElementById('edit-email').value;
    const role = document.getElementById('edit-role').value;

    try {
      await fetch(`http://localhost:3333/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, role }),
      });
      modal.hide();
      loadUsers();
    } catch (err) {
      alert('Error updating user');
    }
  };
};

// Delete a user
const handleDeleteUser = async (e) => {
  const userId = e.target.getAttribute('data-id');
  try {
    await fetch(`http://localhost:3333/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    loadUsers();
  } catch (err) {
    alert('Error deleting user');
  }
};

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('access_token');
  window.location.href = 'login.html';
});

// Load users on page load
loadUsers();
