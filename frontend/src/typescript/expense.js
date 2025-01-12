var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var tokens = localStorage.getItem('access_token');
if (!tokens) {
    window.location.href = 'login.html';
}
// Utility to safely get HTML elements by ID
var getElementById = function (id) {
    var element = document.getElementById(id);
    if (!element) {
        throw new Error("Element with ID \"".concat(id, "\" not found"));
    }
    return element;
};
// Load all expenses
var loadExpensesbyadmin = function () { return __awaiter(_this, void 0, void 0, function () {
    var response, expenses, tableBody_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch('http://localhost:3333/expense/all', {
                        headers: { Authorization: "Bearer ".concat(tokens) },
                    })];
            case 1:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("Failed to fetch expenses: ".concat(response.status));
                }
                return [4 /*yield*/, response.json()];
            case 2:
                expenses = _a.sent();
                tableBody_1 = getElementById('expenses-table');
                tableBody_1.innerHTML = '';
                expenses.forEach(function (expense) {
                    var row = document.createElement('tr');
                    row.innerHTML = "\n        <td>".concat(expense.id, "</td>\n        <td>").concat(expense.name, "</td>\n        <td>").concat(expense.description, "</td>\n        <td>").concat(expense.amount, "</td>\n        <td>\n          <button class=\"btn btn-warning btn-sm edit-expense-btn\" data-id=\"").concat(expense.id, "\">Edit</button>\n          <button class=\"btn btn-danger btn-sm delete-expense-btn\" data-id=\"").concat(expense.id, "\">Delete</button>\n        </td>\n      ");
                    tableBody_1.appendChild(row);
                });
                document.querySelectorAll('.edit-expense-btn').forEach(function (btn) {
                    return btn.addEventListener('click', handleEditExpensebyadmin);
                });
                document.querySelectorAll('.delete-expense-btn').forEach(function (btn) {
                    return btn.addEventListener('click', handleDeleteExpensebyadmin);
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error('Error loading expenses:', error_1);
                alert('Error loading expenses');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Add a new expense
getElementById('add-expense-form').addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
    var name, description, amount, response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                name = getElementById('expense-name').value.trim();
                description = getElementById('expense-description').value.trim();
                amount = parseFloat(getElementById('expense-amount').value);
                if (!name || !description || isNaN(amount)) {
                    alert('Please provide valid input');
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetch('http://localhost:3333/expense', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: "Bearer ".concat(tokens),
                        },
                        body: JSON.stringify({ name: name, description: description, amount: amount }),
                    })];
            case 2:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("Failed to add expense: ".concat(response.status));
                }
                loadExpensesbyadmin();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                alert('Error adding expense');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Edit an expense
var handleEditExpensebyadmin = function (e) {
    var _a, _b, _c;
    var target = e.target;
    var row = target.closest('tr');
    if (!row) {
        alert('Failed to find the table row');
        return;
    }
    var expenseId = target.getAttribute('data-id');
    var name = ((_a = row.children[1].textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
    var description = ((_b = row.children[2].textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '';
    var amount = ((_c = row.children[3].textContent) === null || _c === void 0 ? void 0 : _c.trim()) || '';
    getElementById('edit-expense-name').value = name;
    getElementById('edit-expense-description').value = description;
    getElementById('edit-expense-amount').value = amount;
    var editModalElement = getElementById('editExpenseModal');
    editModalElement.dataset.expenseId = expenseId;
    var editModal = new bootstrap.Modal(editModalElement);
    editModal.show();
};
// Save changes to an expense
getElementById('save-expense-btn').addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
    var editModalElement, expenseId, name, description, amount, response, editModal, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                editModalElement = getElementById('editExpenseModal');
                expenseId = editModalElement.dataset.expenseId;
                name = getElementById('edit-expense-name').value.trim();
                description = getElementById('edit-expense-description').value.trim();
                amount = parseFloat(getElementById('edit-expense-amount').value);
                if (!name || !description || isNaN(amount)) {
                    alert('Please provide valid input');
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetch("http://localhost:3333/expense/".concat(expenseId), {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: "Bearer ".concat(tokens),
                        },
                        body: JSON.stringify({ name: name, description: description, amount: amount }),
                    })];
            case 2:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("Failed to update expense: ".concat(response.status));
                }
                editModal = bootstrap.Modal.getInstance(editModalElement);
                editModal === null || editModal === void 0 ? void 0 : editModal.hide();
                loadExpensesbyadmin();
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                alert('Error updating expense');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Delete an expense
var handleDeleteExpensebyadmin = function (e) { return __awaiter(_this, void 0, void 0, function () {
    var target, expenseId, response, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                target = e.target;
                expenseId = target.getAttribute('data-id');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetch("http://localhost:3333/expense/".concat(expenseId), {
                        method: 'DELETE',
                        headers: { Authorization: "Bearer ".concat(tokens) },
                    })];
            case 2:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("Failed to delete expense: ".concat(response.status));
                }
                loadExpensesbyadmin();
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                alert('Error deleting expense');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Logout functionality
getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('access_token');
    window.location.href = 'login.html';
});
// Load expenses on page load
loadExpensesbyadmin();
