document.getElementById('login-form')?.addEventListener('submit', async (event: Event) => {
    event.preventDefault();
  
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
  
    try {
      const response = await fetch('http://localhost:3333/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to log in');
      }
  
      const data = await response.json();
      alert('Login successful!');
  
      // Store the token in localStorage or cookies if required
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('role', data.role);
      console.log(data);
  
      // Redirect to dashboard or another page
      if (data.role === 'CEO') {
        window.location.href ="admin.html";
        console.log("Redirecting to:", window.location.href);
  
      } else if (data.role === 'EMPLOYEE') {
        window.location.href ="employe.html";
        console.log("Redirecting to:", window.location.href);
      }
  
    } catch (error) {
      console.error('Error:', error);
      alert((error as Error).message || 'An error occurred');
    }
  });
  