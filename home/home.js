import { logoutUser } from '../js/auth.js';
import { auth, db } from '../js/firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { showMessage, checkAuthAndRedirect } from '../js/utils.js';

document.addEventListener('DOMContentLoaded', function() {
    //Se não houver usuário volta para o login
    checkAuthAndRedirect(auth, false);

    const logoutBtn = document.getElementById('logoutBtn');
    const userNameSpan = document.getElementById('userName');

    onAuthStateChanged(auth, async (user) => {
        if (!user) return;

        try {
            const userDoc = await getDoc(doc(db, "usuarios", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                userNameSpan.textContent = userData.nome || user.email;
            } else {
                userNameSpan.textContent = user.email;
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            userNameSpan.textContent = user.email;
        }
    });

    logoutBtn.addEventListener('click', async function() {
        const result = await logoutUser();
        if (result.success) {
            window.location.href = '../index.html';
        } else {
            showMessage('message', 'Erro ao fazer logout: ' + result.error, 'error');
        }
    });
});