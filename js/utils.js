export function showMessage(elementId, text, type = 'info') {
    const messageDiv = document.getElementById(elementId);
    if (!messageDiv) return;

    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function hideMessage(elementId) {
    const messageDiv = document.getElementById(elementId);
    if (messageDiv) {
        messageDiv.style.display = 'none';
    }
}

export function setButtonLoading(button, isLoading, loadingText = 'Carregando...') {
    if (!button) return;

    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = loadingText;
        button.disabled = true;
    } else {
        button.textContent = button.dataset.originalText || 'Enviar';
        button.disabled = false;
    }
}

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function getPasswordStrength(password) {
    if (password.length < 6) return 'weak';
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
        return 'strong';
    }
    if (password.length >= 8) return 'medium';
    return 'weak';
}

export function applyPhoneMask(phone) {
    let value = phone.replace(/\D/g, '');

    if (value.length <= 11) {
        if (value.length <= 2) {
            value = value.replace(/^(\d{0,2})/, '($1');
        } else if (value.length <= 6) {
            value = value.replace(/^(\d{2})(\d{0,4})/, '($1) $2');
        } else if (value.length <= 10) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
    }

    return value;
}

export function translateFirebaseError(error) {
    const errorMessage = error.toString().toLowerCase();

    if (errorMessage.includes('email-already-in-use')) {
        return 'Este email já está em uso.';
    } else if (errorMessage.includes('invalid-email')) {
        return 'Email inválido. Por favor, verifique o email informado.';
    } else if (errorMessage.includes('weak-password')) {
        return 'Senha muito fraca. Use uma senha mais forte.';
    } else if (errorMessage.includes('user-not-found')) {
        return 'Nenhuma conta encontrada com este email.';
    } else if (errorMessage.includes('wrong-password')) {
        return 'Senha incorreta. Tente novamente.';
    } else if (errorMessage.includes('too-many-requests')) {
        return 'Muitas tentativas. Tente novamente mais tarde.';
    } else if (errorMessage.includes('network-request-failed')) {
        return 'Erro de conexão. Verifique sua internet!';
    } else if (errorMessage.includes('invalid-login-credentials')) {
        return 'Nenhuma conta encontrada';
    }

    return error.toString();
}

export function redirectAfterDelay(url, delay = 2000) {
    setTimeout(() => {
        window.location.href = url;
    }, delay);
}

export function checkAuthAndRedirect(auth, redirectIfAuthenticated = true) {
    return new Promise((resolve) => {
        const { onAuthStateChanged } = requireAuth();

        onAuthStateChanged(auth, (user) => {
            if (user && redirectIfAuthenticated) {
                window.location.href = 'home/home.html';
            } else if (!user && !redirectIfAuthenticated) {
                window.location.href = '../index.html';
            }
            resolve(!!user);
        });
    });
}

function requireAuth() {
    return {
        onAuthStateChanged: (auth, callback) => {
            import("https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js")
                .then(({ onAuthStateChanged }) => {
                    onAuthStateChanged(auth, callback);
                });
        }
    };
}

export function formatDate(dateString) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

export function validateFormFields(fields) {
    for (const field of fields) {
        if (!field.value.trim()) {
            return { isValid: false, field: field.name };
        }
    }
    return { isValid: true };
}

export function debugLog(message, data = null) {
    if (console && console.log) {
        console.log(`[DEBUG] ${message}`, data || '');
    }
}