localStorage.clear();
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());
        console.log('Form data:', data);
        try {
            const response = await axios.post('/api/auth/register', data);
            errorMessage.textContent = '';
            if (response.data.success) {
                window.location.href = '/api/auth/login';
            } else {
                errorMessage.textContent = response.data.message;
            }
        } catch (error) {
            console.error('Registration error:', error);
            errorMessage.textContent = 'An error occurred during registration. Please try again.';
        }
    });
});