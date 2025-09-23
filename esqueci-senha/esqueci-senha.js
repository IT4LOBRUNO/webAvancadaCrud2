import { resetPassword } from '../js/auth.js';
import { auth } from '../js/firebase-config.js';
import { showMessage, setButtonLoading, translateFirebaseError, validateEmail, checkAuthAndRedirect } from '../js/utils.js';

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se usuário já está logado
    checkAuthAndRedirect(auth, true);

    const esqueciSenhaForm = document.getElementById('esqueciSenhaForm');

    if (esqueciSenhaForm) {
        esqueciSenhaForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();

            if (!email) {
                showMessage('message', 'Por favor, informe seu email', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showMessage('message', 'Por favor, informe um email válido', 'error');
                return;
            }

            const submitButton = esqueciSenhaForm.querySelector('button[type="submit"]');
            setButtonLoading(submitButton, true, 'Enviando...');

            const result = await resetPassword(email);

            if (result.success) {
                showMessage('message', 'Email de recuperação enviado! Verifique sua caixa de entrada e spam.', 'success');
                esqueciSenhaForm.reset();
                setButtonLoading(submitButton, true, 'Email Enviado!');
                setTimeout(() => window.location.href = '../index.html', 5000);
            } else {
                showMessage('message', translateFirebaseError(result.error), 'error');
                setButtonLoading(submitButton, false);
            }
        });
    }
});