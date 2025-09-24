import { logoutUser } from '../js/auth.js';
import { auth, db } from '../js/firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

function checkUserLoggedIn() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = "../index.html";
        } else {
            loadUserData(user);
        }
    });
}

async function loadUserData(user) {
    try {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            elements.userName().textContent = userData.nome || user.email;
        } else {
            elements.userName().textContent = user.email;
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        elements.userName().textContent = user.email;
    }
}

async function handleLogout() {
    const result = await logoutUser();
    if (result.success) {
        window.location.href = '../index.html';
    } else {
        alert('Erro ao fazer logout: ' + result.error);
    }
}

function onClickLogout() {
    handleLogout();
}

const elements = {
    userName: () => document.getElementById('userName'),
    logoutBtn: () => document.getElementById('logoutBtn')
};

document.addEventListener('DOMContentLoaded', function () {
    checkUserLoggedIn();

    if (elements.logoutBtn()) {
        elements.logoutBtn().addEventListener('click', onClickLogout);
    }
});

window.logout = handleLogout;
