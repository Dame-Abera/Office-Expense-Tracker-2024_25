const tokens: string | null = localStorage.getItem('access_token');

if (!tokens) {
  window.location.href = 'login.html';
}

// Expense interface
interface Expense {
  id: number;
  name: string;
  description: string;
  amount: number;
}

// Utility to safely get HTML elements by ID
const getElementById = <T extends HTMLElement>(id: string): T => {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with ID "${id}" not found`);
  }
  return element as T;
};

// Load all expenses
const loadExpensesbyadmin = async (): Promise<void> => {
  try {
    const response = await fetch('http://localhost:3333/expense/all', {
      headers: { Authorization: `Bearer ${tokens}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch expenses: ${response.status}`);
    }

    const expenses: Expense[] = await response.json();
    const tableBody = getElementById<HTMLTableSectionElement>('expenses-table');
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
      btn.addEventListener('click', handleEditExpensebyadmin)
    );
    document.querySelectorAll('.delete-expense-btn').forEach((btn) =>
      btn.addEventListener('click', handleDeleteExpensebyadmin)
    );
  } catch (error) {
    console.error('Error loading expenses:', error);
    alert('Error loading expenses');
  }
};

// Add a new expense
getElementById<HTMLFormElement>('add-expense-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = getElementById<HTMLInputElement>('expense-name').value.trim();
  const description = getElementById<HTMLInputElement>('expense-description').value.trim();
  const amount = parseFloat(getElementById<HTMLInputElement>('expense-amount').value);

  if (!name || !description || isNaN(amount)) {
    alert('Please provide valid input');
    return;
  }

  try {
    const response = await fetch('http://localhost:3333/expense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens}`,
      },
      body: JSON.stringify({ name, description, amount }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add expense: ${response.status}`);
    }

    loadExpensesbyadmin();
  } catch (error) {
    alert('Error adding expense');
  }
});

// Edit an expense
const handleEditExpensebyadmin = (e: Event): void => {
  const target = e.target as HTMLButtonElement;
  const row = target.closest('tr') as HTMLTableRowElement | null;

  if (!row) {
    alert('Failed to find the table row');
    return;
  }

  const expenseId = target.getAttribute('data-id') as string;
  const name = row.children[1].textContent?.trim() || '';
  const description = row.children[2].textContent?.trim() || '';
  const amount = row.children[3].textContent?.trim() || '';

  getElementById<HTMLInputElement>('edit-expense-name').value = name;
  getElementById<HTMLInputElement>('edit-expense-description').value = description;
  getElementById<HTMLInputElement>('edit-expense-amount').value = amount;

  const editModalElement = getElementById<HTMLElement>('editExpenseModal');
  editModalElement.dataset.expenseId = expenseId;

  const editModal = new bootstrap.Modal(editModalElement);
  editModal.show();
};

// Save changes to an expense
getElementById<HTMLButtonElement>('save-expense-btn').addEventListener('click', async () => {
  const editModalElement = getElementById<HTMLElement>('editExpenseModal');
  const expenseId = editModalElement.dataset.expenseId as string;

  const name = getElementById<HTMLInputElement>('edit-expense-name').value.trim();
  const description = getElementById<HTMLInputElement>('edit-expense-description').value.trim();
  const amount = parseFloat(getElementById<HTMLInputElement>('edit-expense-amount').value);

  if (!name || !description || isNaN(amount)) {
    alert('Please provide valid input');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3333/expense/${expenseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens}`,
      },
      body: JSON.stringify({ name, description, amount }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update expense: ${response.status}`);
    }

    const editModal = bootstrap.Modal.getInstance(editModalElement);
    editModal?.hide();
    loadExpensesbyadmin();
  } catch (error) {
    alert('Error updating expense');
  }
});

// Delete an expense
const handleDeleteExpensebyadmin = async (e: Event): Promise<void> => {
  const target = e.target as HTMLButtonElement;
  const expenseId = target.getAttribute('data-id') as string;

  try {
    const response = await fetch(`http://localhost:3333/expense/${expenseId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokens}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete expense: ${response.status}`);
    }

    loadExpensesbyadmin();
  } catch (error) {
    alert('Error deleting expense');
  }
};

// Logout functionality
getElementById<HTMLButtonElement>('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('access_token');
  window.location.href = 'login.html';
});

// Load expenses on page load
loadExpensesbyadmin();
