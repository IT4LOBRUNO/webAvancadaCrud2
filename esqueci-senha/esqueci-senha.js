import { resetPassword } from '../js/auth.js';
import { auth } from '../js/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { showMessage, setButtonLoading, translateFirebaseError, validateEmail } from '../js/utils.js';

function checkUserLoggedIn() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = "../home/home.html";
        }
    });
}

function onChangeEmail() {
    toggleButtonsDisable();
    toggleEmailErrors();
}

function toggleEmailErrors() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
}

function toggleButtonsDisable() {
    const emailValid = isEmailValid();
    form.recoverButton().disabled = !emailValid;
}

function isEmailValid() {
    const email = form.email().value;
    return email && validateEmail(email);
}

async function recuperarSenha() {
    setButtonLoading(form.recoverButton(), true, 'Enviando...');
    
    try {
        const result = await resetPassword(form.email().value);
        
        if (result.success) {
            showMessage('message', 'Email de recuperação enviado! Verifique sua caixa de entrada.', 'success');
            form.recoverButton().disabled = true;
            form.recoverButton().textContent = 'Email Enviado!';
            
            setTimeout(() => {
                window.location.href = "../index.html";
            }, 5000);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        showMessage('message', translateFirebaseError(error.message), 'error');
        setButtonLoading(form.recoverButton(), false);
    }
}

function voltarLogin() {
    window.location.href = "../index.html";
}

const form = {
    email: () => document.getElementById("email"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    recoverButton: () => document.getElementById("recover-button")
}

document.addEventListener('DOMContentLoaded', function() {
    checkUserLoggedIn();
    
    if (form.email()) {
        form.email().addEventListener('input', onChangeEmail);
    }
    
    toggleButtonsDisable();
});

window.recuperarSenha = recuperarSenha;
window.voltarLogin = voltarLogin;
window.onChangeEmail = onChangeEmail;