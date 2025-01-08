const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = 'login.html';
    }

    // Load all users
    const loadUsers = async () => {
      const response = await fetch('http://localhost:3333/admin/users', {
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
            <button class="btn btn-danger btn-sm delete-user-btn" data-id="${user.id}">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      document.querySelectorAll('.delete-user-btn').forEach((btn) =>
        btn.addEventListener('click', handleDeleteUser)
      );
    };

    // Load all expenses
    const loadExpenses = async () => {
      const response = await fetch('http://localhost:3333/admin/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const expenses = await response.json();
      const tableBody = document.getElementById('expenses-table');
      tableBody.innerHTML = '';

      expenses.forEach((expense) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${expense.id}</td>
          <td>${expense.name}</td>
          <td>${expense.description}</td>
          <td>${expense.amount}</td>
          <td>
            <button class="btn btn-warning btn-sm edit-expense-btn" data-id="${expense.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-expense-btn" data-id="${expense.id}">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      document.querySelectorAll('.edit-expense-btn').forEach((btn) =>
        btn.addEventListener('click', handleEditExpense)
      );
      document.querySelectorAll('.delete-expense-btn').forEach((btn) =>
        btn.addEventListener('click', handleDeleteExpense)
      );
    };

    // Delete a user
    const handleDeleteUser = async (e) => {
      const userId = e.target.getAttribute('data-id');
      try {
        await fetch(`http://localhost:3333/admin/user/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        loadUsers();
      } catch (err) {
        alert('Error deleting user');
      }
    };

    // Delete an expense
    const handleDeleteExpense = async (e) => {
      const expenseId = e.target.getAttribute('data-id');
      try {
        await fetch(`http://localhost:3333/expense/${expenseId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        loadExpenses();
      } catch (err) {
        alert('Error deleting expense');
      }
    };

    // Edit an expense
    const handleEditExpense = async (e) => {
      const expenseId = e.target.getAttribute('data-id');
      const name = prompt('Enter new name:');
      const description = prompt('Enter new description:');
      const amount = prompt('Enter new amount:');
      try {
        await fetch(`http://localhost:3333/expense/${expenseId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, description, amount }),
        });
        loadExpenses();
      } catch (err) {
        alert('Error updating expense');
      }
    };

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });

    // Load users and expenses on page load
    loadUsers();
    loadExpenses();