document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  // Retrieve form data
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  try {
    // Send a POST request to the signup endpoint
    const response = await fetch('http://localhost:3333/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data); // Log the backend response for debugging
      alert('Signup successful! Redirecting to login page.');
      window.location.href = 'login.html'; // Redirect to the login page
    } else {
      const errorData = await response.json();
      alert(errorData.message || 'Signup failed! Please check your input.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again later.');
  }
});
