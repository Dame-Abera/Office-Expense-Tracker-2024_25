// Check for token in localStorage
const authToken: string | null = localStorage.getItem('access_token');
if (!authToken) {
  window.location.href = 'login.html'; // Redirect if no token is found
}

// Function to load all users
const loadUsers = async (): Promise<void> => {
  try {
    const response = await fetch('http://localhost:3333/users', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!response.ok) throw new Error('Failed to load users');

    const users: { id: string; email: string; role: string }[] = await response.json();
    const tableBody = document.getElementById('users-table') as HTMLTableSectionElement;
    tableBody.innerHTML = '';

    users.forEach((user) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="btn btn-warning btn-sm edit-user-btn" data-id="${user.id}">Edit</button>
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
  } catch (err) {
    alert(`Error: ${err instanceof Error ? err.message : 'An error occurred'}`);
  }
};

// Function to handle adding a new user
document.getElementById('add-user-form')?.addEventListener('submit', async (e: Event) => {
  e.preventDefault();
  const email = (document.getElementById('user-email') as HTMLInputElement).value;
  const password = (document.getElementById('user-password') as HTMLInputElement).value;
  const role = (document.getElementById('user-role') as HTMLInputElement).value;

  try {
    const response = await fetch('http://localhost:3333/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ email, password, role }),
    });
    if (!response.ok) throw new Error('Failed to add user');
    loadUsers();
  } catch (err) {
    alert(`Error: ${err instanceof Error ? err.message : 'An error occurred'}`);
  }
});

// Function to handle editing a user
const handleEditUser = async (e: Event): Promise<void> => {
  const target = e.target as HTMLElement;
  const userId = target.getAttribute('data-id');
  if (!userId) return;

  try {
    const response = await fetch(`http://localhost:3333/users/${userId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) throw new Error('Failed to fetch user data');
    const user: { email: string; role: string } = await response.json();

    // Fill modal fields
    (document.getElementById('edit-email') as HTMLInputElement).value = user.email;
    (document.getElementById('edit-role') as HTMLInputElement).value = user.role;

    // Open modal
    const modal = new bootstrap.Modal(document.getElementById('editUserModal') as HTMLElement);
    modal.show();

    // Bind update event
    document.getElementById('update-user-btn')?.addEventListener('click', async () => {
      const email = (document.getElementById('edit-email') as HTMLInputElement).value;
      const role = (document.getElementById('edit-role') as HTMLInputElement).value;

      try {
        const updateResponse = await fetch(`http://localhost:3333/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ email, role }),
        });

        if (!updateResponse.ok) throw new Error('Failed to update user');
        modal.hide();  // Hide modal after update
        loadUsers();   // Reload users
      } catch (err) {
        alert(`Error: ${err instanceof Error ? err.message : 'An error occurred'}`);
      }
    });
  } catch (err) {
    alert(`Error: ${err instanceof Error ? err.message : 'An error occurred'}`);
  }
};

// Function to handle deleting a user
const handleDeleteUser = async (e: Event): Promise<void> => {
  const target = e.target as HTMLElement;
  const userId = target.getAttribute('data-id');
  if (!userId) return;

  try {
    const response = await fetch(`http://localhost:3333/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!response.ok) throw new Error('Failed to delete user');
    loadUsers();
  } catch (err) {
    alert(`Error: ${err instanceof Error ? err.message : 'An error occurred'}`);
  }
};

// Logout functionality
document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('access_token');
  window.location.href = 'login.html';
});

// Load users on page load
loadUsers();
