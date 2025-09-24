# Sistema de Gerenciamento de Usuários

## Funcionalidades

- **Autenticação Segura**: Login, cadastro e recuperação de senha.  
- **Gerenciamento de Usuários**: Cadastro com validação de dados.  
- **Relatórios**: Visualização e exportação de usuários em CSV.  
- **Design Responsivo**: Funciona em desktop e mobile.  
- **Integração com Firebase**: Backend com Firestore e Authentication.  

## Setup do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).  
2. Ative **Authentication** com provedor Email/Senha.  
3. Crie um **Firestore Database**.  
4. Configure as regras de segurança conforme necessário.  

## Como Usar

### Login
1. Abra `index.html`.  
2. Use seu email e senha para fazer login.  
3. Será redirecionado para a página **home**.  

### Cadastro de Usuários
1. Clique em "Criar conta" na página de login.  
2. Preencha **nome, telefone, email e senha**.  
3. O sistema cria a conta e faz logout automático.  

### Relatórios
1. Na página **home**, clique em "Acessar Relatórios".  
2. Visualize todos os usuários cadastrados.  
3. Clique em "Exportar CSV" para baixar os dados.  

### Exportação CSV
O arquivo CSV contém:  
- Nome do usuário  
- Email  
- Telefone  
- Data de criação  

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)  
- **Backend**: Firebase Authentication, Firestore  
- **UI/UX**: CSS Grid, Flexbox, Gradients  
- **Exportação**: Blob API, File Download  
