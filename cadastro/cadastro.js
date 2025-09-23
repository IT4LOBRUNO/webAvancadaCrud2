import { createUser, logoutUser } from '../js/auth.js';
import { db, auth } from '../js/firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { showMessage, setButtonLoading, translateFirebaseError, applyPhoneMask, getPasswordStrength } from '../js/utils.js';

document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
    const senhaInput = document.getElementById('senha');
    const confirmacaoSenhaInput = document.getElementById('confirmacaoSenha');
    const telefoneInput = document.getElementById('telefone');

    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            e.target.value = applyPhoneMask(e.target.value);
        });
    }

    if (senhaInput) {
        senhaInput.addEventListener('input', function() {
            validatePasswordStrength();
            validatePasswordMatch();
        });
    }

    if (confirmacaoSenhaInput) {
        confirmacaoSenhaInput.addEventListener('input', validatePasswordMatch);
    }

    function validatePasswordStrength() {
        const password = senhaInput.value;
        const strength = getPasswordStrength(password);
        
        const existingMessage = senhaInput.parentNode.querySelector('.password-strength');
        if (existingMessage) existingMessage.remove();
        
        if (password) {
            const strengthMessage = document.createElement('div');
            strengthMessage.className = `password-strength ${strength}`;
            
            const messages = {
                weak: 'Senha fraca (mínimo 6 caracteres)',
                medium: 'Senha média',
                strong: 'Senha forte'
            };
            
            strengthMessage.textContent = messages[strength];
            senhaInput.parentNode.appendChild(strengthMessage);
        }
    }

    function validatePasswordMatch() {
        if (!senhaInput || !confirmacaoSenhaInput) return;
        
        const password = senhaInput.value;
        const confirmPassword = confirmacaoSenhaInput.value;
        
        const existingMessage = confirmacaoSenhaInput.parentNode.querySelector('.password-match');
        if (existingMessage) existingMessage.remove();
        
        if (confirmPassword && password !== confirmPassword) {
            const matchMessage = document.createElement('div');
            matchMessage.className = 'password-match error';
            matchMessage.style.cssText = 'color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;';
            matchMessage.textContent = 'As senhas não coincidem';
            confirmacaoSenhaInput.parentNode.appendChild(matchMessage);
        }
    }

    // Cadastro
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value.trim();
            const telefone = document.getElementById('telefone').value;
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value;
            const confirmacaoSenha = document.getElementById('confirmacaoSenha').value;

            if (!nome) {
                showMessage('message', 'Por favor, informe seu nome completo', 'error');
                return;
            }

            if (!email) {
                showMessage('message', 'Por favor, informe um email válido', 'error');
                return;
            }

            if (senha.length < 6) {
                showMessage('message', 'A senha deve ter pelo menos 6 caracteres', 'error');
                return;
            }

            if (senha !== confirmacaoSenha) {
                showMessage('message', 'As senhas não coincidem', 'error');
                return;
            }

            const submitButton = cadastroForm.querySelector('button[type="submit"]');
            setButtonLoading(submitButton, true, 'Criando conta...');

            try {
                console.log('Iniciando criação de usuário...');
                
                const authResult = await createUser(email, senha);
                
                if (authResult.success) {
                    console.log('Usuário criado no Auth, UID:', authResult.user.uid);
                    
                    const userData = {
                        nome,
                        telefone,
                        email,
                        dataCriacao: new Date().toISOString()
                    };
                    
                    console.log('Salvando dados no Firestore:', userData);
                    await setDoc(doc(db, "usuarios", authResult.user.uid), userData);
                    console.log('Dados salvos com sucesso no Firestore');
                    
                    // Antiga dor de cabeça ao salvar (O logout deve ser feito após salvar o usuário, caso contrário o usuário não fica registrado)
                    await logoutUser();
                    console.log('Logout realizado');
                    
                    showMessage('message', 'Conta criada com sucesso! Redirecionando para login...', 'success');
                    
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 2000);
                    
                } else {
                    console.error('Erro ao criar usuário:', authResult.error);
                    showMessage('message', translateFirebaseError(authResult.error), 'error');
                    setButtonLoading(submitButton, false);
                }
            } catch (error) {
                console.error('Erro geral:', error);
                showMessage('message', 'Erro inesperado: ' + error.message, 'error');
                setButtonLoading(submitButton, false);
            }
        });
    }
});