import { loginUser } from './js/auth.js';
import { auth } from './js/firebase-config.js';
import { showMessage, setButtonLoading, translateFirebaseError, checkAuthAndRedirect } from './js/utils.js';

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se usuário já está logado
    checkAuthAndRedirect(auth, true);
    
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitButton = loginForm.querySelector('button[type="submit"]');

        setButtonLoading(submitButton, true, 'Entrando...');

        const result = await loginUser(email, password);

        if (result.success) {
            showMessage('message', 'Login realizado com sucesso!', 'success');
            setTimeout(() => {
                window.location.href = 'home/home.html';
            }, 1000);
        } else {
            showMessage('message', translateFirebaseError(result.error), 'error');
            setButtonLoading(submitButton, false);
        }
    });
});