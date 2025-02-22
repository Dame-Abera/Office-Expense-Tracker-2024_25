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
var _a, _b;
var _this = this;
// Check for token in localStorage
var authToken = localStorage.getItem('access_token');
if (!authToken) {
    window.location.href = 'login.html'; // Redirect if no token is found
}
// Function to load all users
var loadUsers = function () { return __awaiter(_this, void 0, void 0, function () {
    var response, users, tableBody_1, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch('http://localhost:3333/users', {
                        headers: { Authorization: "Bearer ".concat(authToken) },
                    })];
            case 1:
                response = _a.sent();
                if (!response.ok)
                    throw new Error('Failed to load users');
                return [4 /*yield*/, response.json()];
            case 2:
                users = _a.sent();
                tableBody_1 = document.getElementById('users-table');
                tableBody_1.innerHTML = '';
                users.forEach(function (user) {
                    var row = document.createElement('tr');
                    row.innerHTML = "\n        <td>".concat(user.id, "</td>\n        <td>").concat(user.email, "</td>\n        <td>").concat(user.role, "</td>\n        <td>\n          <button class=\"btn btn-warning btn-sm edit-user-btn\" data-id=\"").concat(user.id, "\">Edit</button>\n        </td>\n      ");
                    tableBody_1.appendChild(row);
                });
                document.querySelectorAll('.edit-user-btn').forEach(function (btn) {
                    return btn.addEventListener('click', handleEditUser);
                });
                document.querySelectorAll('.delete-user-btn').forEach(function (btn) {
                    return btn.addEventListener('click', handleDeleteUser);
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                alert("Error: ".concat(err_1 instanceof Error ? err_1.message : 'An error occurred'));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Function to handle adding a new user
(_a = document.getElementById('add-user-form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
    var email, password, role, response, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                email = document.getElementById('user-email').value;
                password = document.getElementById('user-password').value;
                role = document.getElementById('user-role').value;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetch('http://localhost:3333/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: "Bearer ".concat(authToken),
                        },
                        body: JSON.stringify({ email: email, password: password, role: role }),
                    })];
            case 2:
                response = _a.sent();
                if (!response.ok)
                    throw new Error('Failed to add user');
                loadUsers();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                alert("Error: ".concat(err_2 instanceof Error ? err_2.message : 'An error occurred'));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Function to handle editing a user
var handleEditUser = function (e) { return __awaiter(_this, void 0, void 0, function () {
    var target, userId, response, user, modal_1, err_3;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                target = e.target;
                userId = target.getAttribute('data-id');
                if (!userId)
                    return [2 /*return*/];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch("http://localhost:3333/users/".concat(userId), {
                        headers: { Authorization: "Bearer ".concat(authToken) },
                    })];
            case 2:
                response = _b.sent();
                if (!response.ok)
                    throw new Error('Failed to fetch user data');
                return [4 /*yield*/, response.json()];
            case 3:
                user = _b.sent();
                // Fill modal fields
                document.getElementById('edit-email').value = user.email;
                document.getElementById('edit-role').value = user.role;
                modal_1 = new bootstrap.Modal(document.getElementById('editUserModal'));
                modal_1.show();
                // Bind update event
                (_a = document.getElementById('update-user-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                    var email, role, updateResponse, err_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                email = document.getElementById('edit-email').value;
                                role = document.getElementById('edit-role').value;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, fetch("http://localhost:3333/users/".concat(userId), {
                                        method: 'PATCH',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: "Bearer ".concat(authToken),
                                        },
                                        body: JSON.stringify({ email: email, role: role }),
                                    })];
                            case 2:
                                updateResponse = _a.sent();
                                if (!updateResponse.ok)
                                    throw new Error('Failed to update user');
                                modal_1.hide(); // Hide modal after update
                                loadUsers(); // Reload users
                                return [3 /*break*/, 4];
                            case 3:
                                err_4 = _a.sent();
                                alert("Error: ".concat(err_4 instanceof Error ? err_4.message : 'An error occurred'));
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [3 /*break*/, 5];
            case 4:
                err_3 = _b.sent();
                alert("Error: ".concat(err_3 instanceof Error ? err_3.message : 'An error occurred'));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
// Function to handle deleting a user
var handleDeleteUser = function (e) { return __awaiter(_this, void 0, void 0, function () {
    var target, userId, response, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                target = e.target;
                userId = target.getAttribute('data-id');
                if (!userId)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetch("http://localhost:3333/users/".concat(userId), {
                        method: 'DELETE',
                        headers: { Authorization: "Bearer ".concat(authToken) },
                    })];
            case 2:
                response = _a.sent();
                if (!response.ok)
                    throw new Error('Failed to delete user');
                loadUsers();
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                alert("Error: ".concat(err_5 instanceof Error ? err_5.message : 'An error occurred'));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Logout functionality
(_b = document.getElementById('logout-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    localStorage.removeItem('access_token');
    window.location.href = 'login.html';
});
// Load users on page load
loadUsers();
