import { createUser, logoutUser } from '../js/auth.js';
import { db } from '../js/firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { showMessage, setButtonLoading, translateFirebaseError, applyPhoneMask } from '../js/utils.js';

function onChangeNome() {
    toggleNomeErrors();
    toggleButtonsDisable();
}

function onChangeTelefone() {
    formatTelefone();
    toggleTelefoneErrors();
    toggleButtonsDisable();
}

function onChangeEmail() {
    toggleEmailErrors();
    toggleButtonsDisable();
}

function onChangeSenha() {
    togglePasswordErrors();
    toggleButtonsDisable();
}

function onChangeConfirmacaoSenha() {
    togglePasswordMatch();
    toggleButtonsDisable();
}

function isNomeValid() {
    return form.nome().value.trim() !== "";
}

function isTelefoneValid() {
    return form.telefone().value.trim() !== "";
}

function isEmailValid() {
    const email = form.email().value.trim();
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

function isSenhaValid() {
    const senha = form.senha().value;
    return senha.length >= 6;
}

function isSenhaMatch() {
    return form.senha().value === form.confirmacaoSenha().value;
}

function isFormValid() {
    return isNomeValid() && isTelefoneValid() && isEmailValid() && isSenhaValid() && isSenhaMatch();
}

function toggleNomeErrors() {
    if (!isNomeValid()) {
        form.nome().classList.add("input-error");
        showFieldError(form.nome(), "Informe seu nome completo");
    } else {
        clearFieldError(form.nome());
    }
}

function toggleTelefoneErrors() {
    if (!isTelefoneValid()) {
        form.telefone().classList.add("input-error");
        showFieldError(form.telefone(), "Informe um telefone válido");
    } else {
        clearFieldError(form.telefone());
    }
}

function toggleEmailErrors() {
    if (!form.email().value) {
        showFieldError(form.email(), "O email é obrigatório");
    } else if (!isEmailValid()) {
        showFieldError(form.email(), "Formato de email inválido");
    } else {
        clearFieldError(form.email());
    }
}

function togglePasswordErrors() {
    if (!form.senha().value) {
        showFieldError(form.senha(), "A senha é obrigatória");
    } else if (!isSenhaValid()) {
        showFieldError(form.senha(), "A senha deve ter pelo menos 6 caracteres");
    } else {
        clearFieldError(form.senha());
    }
}

function togglePasswordMatch() {
    if (!isSenhaMatch()) {
        showFieldError(form.confirmacaoSenha(), "As senhas não coincidem");
    } else {
        clearFieldError(form.confirmacaoSenha());
    }
}

function showFieldError(input, message) {
    clearFieldError(input);
    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
    input.classList.add("input-error");
}

function clearFieldError(input) {
    const existing = input.parentNode.querySelector(".field-error");
    if (existing) existing.remove();
    input.classList.remove("input-error");
}

function clearAllFieldErrors() {
    document.querySelectorAll(".field-error").forEach(el => el.remove());
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
}

function formatTelefone() {
    form.telefone().value = applyPhoneMask(form.telefone().value);
}

function toggleButtonsDisable() {
    form.cadastroButton().disabled = !isFormValid();
}

async function cadastrar() {
    clearAllFieldErrors();

    if (!isFormValid()) {
        toggleNomeErrors();
        toggleTelefoneErrors();
        toggleEmailErrors();
        togglePasswordErrors();
        togglePasswordMatch();

        showMessage("message", "Por favor, corrija os erros acima.", "error");
        return;
    }

    const nome = form.nome().value.trim();
    const telefone = form.telefone().value.trim();
    const email = form.email().value.trim();
    const senha = form.senha().value;

    const submitButton = form.cadastroButton();
    setButtonLoading(submitButton, true, "Criando conta...");

    //Pesadelo ao salvar no firestore (O logout deve ser feito após salvar o usuário, caso contrário o usuário não fica registrado)
    try {
        const authResult = await createUser(email, senha); //await espera a criação do usuário, se não for assim o usuário não fica salvo no firestore por causa do logout, após logout voltar para a tela de login inicial

        if (authResult.success) {
            const userData = {
                nome,
                telefone,
                email,
                dataCriacao: new Date().toISOString()
            };

            await setDoc(doc(db, "usuarios", authResult.user.uid), userData);
            await logoutUser();

            showMessage("message", "Conta criada com sucesso! Redirecionando para login...", "success");

            setTimeout(() => {
                window.location.href = "../index.html";
            }, 2000);
        } else {
            showMessage("message", translateFirebaseError(authResult.error), "error");
            setButtonLoading(submitButton, false);
        }
    } catch (error) {
        showMessage("message", "Erro inesperado: " + error.message, "error");
        setButtonLoading(submitButton, false);
    }
}

const form = {
    nome: () => document.getElementById("nome"),
    telefone: () => document.getElementById("telefone"),
    email: () => document.getElementById("email"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    senha: () => document.getElementById("senha"),
    senhaRequiredError: () => document.getElementById("senha-required-error"),
    senhaMinLengthError: () => document.getElementById("senha-minlength-error"),
    confirmacaoSenha: () => document.getElementById("confirmacaoSenha"),
    senhaMatchError: () => document.getElementById("senha-match-error"),
    cadastroButton: () => document.getElementById("cadastro-button")
};

document.addEventListener("DOMContentLoaded", () => {
    form.nome().addEventListener("input", onChangeNome);
    form.telefone().addEventListener("input", onChangeTelefone);
    form.email().addEventListener("input", onChangeEmail);
    form.senha().addEventListener("input", onChangeSenha);
    form.confirmacaoSenha().addEventListener("input", onChangeConfirmacaoSenha);
    form.cadastroButton().addEventListener("click", (e) => {
        e.preventDefault();
        cadastrar();
    });
});
