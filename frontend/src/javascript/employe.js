const token = localStorage.getItem('access_token');
console.log('office-expense-tracker');

if (!token) {
  window.location.href = './login.html';
}

// Load user's expenses
const loadExpenses = async () => {
  const response = await fetch('http://localhost:3333/expense', {
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

// Add new expense
document.getElementById('add-expense-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('expense-name').value.trim();
  const description = document.getElementById('expense-description').value.trim();
  const amount = parseFloat(document.getElementById('expense-amount').value);
  
  try {
    const response = await fetch('http://localhost:3333/expense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, amount }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error:', errorData);
      alert(`Error: ${errorData.message || 'Failed to add expense'}`);
      return;
    }

    document.getElementById('add-expense-form').reset();
    loadExpenses();
  } catch (err) {
    alert('Error adding expense');
  }
});

// Edit an expense
const handleEditExpense = (e) => {
  const expenseId = e.target.getAttribute('data-id');
  const row = e.target.closest('tr');
  const name = row.children[1].textContent.trim();
  const description = row.children[2].textContent.trim();
  const amount = row.children[3].textContent.trim();

  // Fill modal fields
  document.getElementById('edit-expense-name').value = name;
  document.getElementById('edit-expense-description').value = description;
  document.getElementById('edit-expense-amount').value = amount;

  // Save the ID to a hidden field or a variable
  document.getElementById('editExpenseModal').dataset.expenseId = expenseId;

  // Show the modal
  const editModal = new bootstrap.Modal(document.getElementById('editExpenseModal'));
  editModal.show();
};

// Save changes to expense
document.getElementById('save-expense-btn').addEventListener('click', async () => {
  const expenseId = document.getElementById('editExpenseModal').dataset.expenseId;
  const name = document.getElementById('edit-expense-name').value.trim();
  const description = document.getElementById('edit-expense-description').value.trim();
  const amount = parseFloat(document.getElementById('edit-expense-amount').value);

  try {
    await fetch(`http://localhost:3333/expense/${expenseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, amount }),
    });

    const editModal = bootstrap.Modal.getInstance(document.getElementById('editExpenseModal'));
    editModal.hide();
    loadExpenses();
  } catch (err) {
    alert('Error updating expense');
  }
});

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

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('access_token');
  window.location.href = './login.html';
});

// Load expenses on page load
loadExpenses();