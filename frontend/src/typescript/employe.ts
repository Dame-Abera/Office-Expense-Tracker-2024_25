const token = localStorage.getItem('access_token');

if (!token) {
  window.location.href = "login.html";
}

// Type definition for Expense
interface Expense {
  id: number;
  name: string;
  description: string;
  amount: number;
}

// Load user's expenses
const loadExpenses = async (): Promise<void> => {
  try {
    const response = await fetch('http://localhost:3333/expense', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const expenses: Expense[] = await response.json();
    const tableBody = document.getElementById('expenses-table') as HTMLTableSectionElement;
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
  } catch (err) {
    console.error('Error loading expenses:', err);
  }
};

// Add new expense
document.getElementById('add-expense-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = (document.getElementById('expense-name') as HTMLInputElement).value.trim();
  const description = (document.getElementById('expense-description') as HTMLInputElement).value.trim();
  const amount = parseFloat((document.getElementById('expense-amount') as HTMLInputElement).value);

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

    (document.getElementById('add-expense-form') as HTMLFormElement).reset();
    loadExpenses();
  } catch (err) {
    alert('Error adding expense');
  }
});

// Edit an expense
const handleEditExpense = (e: Event): void => {
  const target = e.target as HTMLButtonElement;
  const expenseId = target.getAttribute('data-id');
  const row = target.closest('tr') as HTMLTableRowElement;
  const name = row.children[1].textContent?.trim() || '';
  const description = row.children[2].textContent?.trim() || '';
  const amount = row.children[3].textContent?.trim() || '';

  (document.getElementById('edit-expense-name') as HTMLInputElement).value = name;
  (document.getElementById('edit-expense-description') as HTMLInputElement).value = description;
  (document.getElementById('edit-expense-amount') as HTMLInputElement).value = amount;

  const editModal = document.getElementById('editExpenseModal')!;
  (editModal as HTMLElement).dataset.expenseId = expenseId || '';

  // Show the modal using Bootstrap
  const bootstrapModal = new bootstrap.Modal(editModal);
  bootstrapModal.show();
};

// Save changes to expense
document.getElementById('save-expense-btn')?.addEventListener('click', async () => {
  const editModal = document.getElementById('editExpenseModal') as HTMLElement;
  const expenseId = editModal.dataset.expenseId || '';
  const name = (document.getElementById('edit-expense-name') as HTMLInputElement).value.trim();
  const description = (document.getElementById('edit-expense-description') as HTMLInputElement).value.trim();
  const amount = parseFloat((document.getElementById('edit-expense-amount') as HTMLInputElement).value);

  try {
    await fetch(`http://localhost:3333/expense/${expenseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, amount }),
    });

    const bootstrapModal = bootstrap.Modal.getInstance(editModal);
    bootstrapModal?.hide();
    loadExpenses();
  } catch (err) {
    alert('Error updating expense');
  }
});

// Delete an expense
const handleDeleteExpense = async (e: Event): Promise<void> => {
  const target = e.target as HTMLButtonElement;
  const expenseId = target.getAttribute('data-id');
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
document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('access_token');
  window.location.href = 'login.html';
});

// Load expenses on page load
loadExpenses();
