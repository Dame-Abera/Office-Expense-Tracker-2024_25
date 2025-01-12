const logoutButton = document.getElementById('logout-btn') as HTMLButtonElement;

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('access_token');
    window.location.href = 'login.html';
  });
}
