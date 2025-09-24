import { auth, db } from '../js/firebase-config.js';
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { formatDate } from '../js/utils.js';

let usuariosData = [];

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, user => {
        if (!user) {
            window.location.href = '../index.html';
            return;
        }
        elements.refreshBtn().addEventListener('click', loadUsers);
        elements.exportCsvBtn().addEventListener('click', exportToCSV);

        loadUsers();
    });
});

async function loadUsers() {
    try {
        toggleLoading(true);
        hideError();
        hideRelatorio();
        hideNoUsers();

        const usuariosRef = collection(db, "usuarios");
        const q = query(usuariosRef, orderBy("dataCriacao", "desc"));
        const snapshot = await getDocs(q);

        toggleLoading(false);

        if (snapshot.empty) {
            usuariosData = [];
            showNoUsers();
            return;
        }

        usuariosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        displayUsers(usuariosData);

    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        toggleLoading(false);
        showError(error.message);
        usuariosData = [];
    }
}

function displayUsers(users) {
    elements.totalUsersSpan().textContent = users.length;
    elements.usuariosTbody().innerHTML = '';

    users.forEach(u => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(u.nome || 'N/A')}</td>
            <td>${escapeHtml(u.email || 'N/A')}</td>
            <td>${escapeHtml(u.telefone || 'N/A')}</td>
            <td>${u.dataCriacao ? formatDate(u.dataCriacao) : 'N/A'}</td>
        `;
        elements.usuariosTbody().appendChild(row);
    });

    elements.relatorioContent().style.display = 'block';
}

function exportToCSV() {
    if (usuariosData.length === 0) {
        alert('Não há dados para exportar. Atualize a página e tente novamente.');
        return;
    }

    try {
        const headers = ['Nome', 'Email', 'Telefone', 'Data de Criação'];
        const csvData = usuariosData.map(u => [
            escapeCsv(u.nome || 'N/A'),
            escapeCsv(u.email || 'N/A'),
            escapeCsv(u.telefone || 'N/A'),
            escapeCsv(u.dataCriacao ? formatDate(u.dataCriacao) : 'N/A')
        ]);
        const csvContent = [headers.join(';'), ...csvData.map(row => row.join(';'))].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showExportSuccess();

    } catch (error) {
        console.error('Erro ao exportar CSV:', error);
        alert('Erro ao exportar CSV: ' + error.message);
    }
}

function toggleLoading(show) {
    elements.loadingDiv().style.display = show ? 'block' : 'none';
}

function showError(msg) {
    elements.errorText().textContent = msg.includes('permission') ? 
        'Permissão negada. Verifique as regras do Firestore.' : 
        `Erro ao carregar usuários: ${msg}`;
    elements.errorMessageDiv().style.display = 'block';
}

function hideError() {
    elements.errorMessageDiv().style.display = 'none';
}

function showNoUsers() {
    elements.noUsersDiv().style.display = 'block';
}

function hideNoUsers() {
    elements.noUsersDiv().style.display = 'none';
}

function hideRelatorio() {
    elements.relatorioContent().style.display = 'none';
}

function escapeCsv(value) {
    if (value.includes(';') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
        return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showExportSuccess() {
    const existing = document.querySelector('.export-success');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = 'export-success';
    msg.textContent = `CSV exportado com sucesso! ${usuariosData.length} usuários exportados.`;

    const relatorioInfo = document.querySelector('.relatorio-info');
    relatorioInfo.parentNode.insertBefore(msg, relatorioInfo.nextSibling);

    setTimeout(() => msg.remove(), 5000);
}

const elements = {
    refreshBtn: () => document.getElementById('refreshBtn'),
    exportCsvBtn: () => document.getElementById('exportCsvBtn'),
    loadingDiv: () => document.getElementById('loading'),
    errorMessageDiv: () => document.getElementById('errorMessage'),
    errorText: () => document.getElementById('errorText'),
    relatorioContent: () => document.getElementById('relatorioContent'),
    noUsersDiv: () => document.getElementById('noUsers'),
    usuariosTbody: () => document.getElementById('usuariosTbody'),
    totalUsersSpan: () => document.getElementById('totalUsers')
};
