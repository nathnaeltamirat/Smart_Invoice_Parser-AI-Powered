localStorage.clear();
document.addEventListener('DOMContentLoaded', () => {
    alert('Register page loaded');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        alert('Login form submitted');
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());
        console.log('Form data:', data);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', data);
            errorMessage.textContent = '';
            if (response.data.success) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                window.location.href = 'http://localhost:5000/api/upload/load';
                 
            } else {
                errorMessage.textContent = response.data.message;
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'An error occurred during Login. Please try again.';
        }
    });
});