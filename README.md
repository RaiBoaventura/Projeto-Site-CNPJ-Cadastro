# Cadastro de CNPJs - Sistema de Gerenciamento

Este projeto é um sistema simples de cadastro e gerenciamento de informações de **CNPJs**. Ele foi desenvolvido em HTML, CSS e JavaScript, e possui três páginas principais que, no futuro, serão integradas com um banco de dados para persistência dos dados.

---

## **Funcionalidades**

1. **Cadastro de CNPJs:**
   - Validação do CNPJ com base no algoritmo oficial.
   - Consulta automática de dados a partir da API pública **BrasilAPI**.
   - Preenchimento automático dos campos como Razão Social, Nome Fantasia, Endereço e mais.

2. **Anexar Documentos:**
   - Upload de documentos necessários para o cadastro:
     - Contrato Social e última alteração.
     - Cartão CNPJ atualizado.
     - Relação de faturamento dos últimos 12 meses.
   - Funcionalidade de **drag-and-drop** e upload convencional.
   - Opção de remover ou baixar documentos diretamente pela interface.

3. **Validação de Formulário:**
   - Verificação dinâmica dos campos obrigatórios e arquivos anexados.
   - Botão "Avançar" habilitado apenas quando todos os campos são preenchidos.

4. **Armazenamento Temporário:**
   - Uso de `localStorage` para salvar dados temporariamente durante a navegação.

---

## **Estrutura do Projeto**

### **Arquivos Principais**

1. **`index.html`**: Página inicial para cadastro de CNPJs.
2. **`socios.html`**: Página para inserção de dados sobre sócios da empresa.
3. **`bancos.html`**: Página destinada a informações bancárias da empresa.

### **Arquivos de Estilo**

- **`style.css`**:
  - Estilos globais para o site.
  - Inclui estilos para drag-and-drop, validação de campos e layout responsivo.

### **Scripts**

- **`index.js`**:
  - Validação de CNPJs.
  - Configuração de drag-and-drop e upload de arquivos.
  - Preenchimento automático de campos com dados obtidos da API.
  - Gerenciamento da lógica de formulário.

---

## **Como Configurar o Projeto**

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/cadastro-cnpjs.git
   cd cadastro-cnpjs
   ```

2. **Abra o projeto no navegador:**

   - Abra o arquivo `index.html` diretamente no navegador para visualizar a aplicação.

---

## **Funcionamento Detalhado**

### **1. Validação de CNPJ**

- O CNPJ digitado no campo é validado pelo **algoritmo oficial**.
- Caso o CNPJ seja válido:
  - Os dados são buscados da API **BrasilAPI**.
  - Os campos do formulário são preenchidos automaticamente.
- Caso inválido:
  - Uma mensagem de erro é exibida e o usuário é solicitado a corrigir o número.

### **2. Upload de Documentos**

- Cada tipo de documento possui seu próprio campo de upload, com drag-and-drop habilitado.
- Documentos anexados aparecem em uma lista com as seguintes opções:
  - **Baixar**: Permite o download do arquivo anexado.
  - **Remover**: Exclui o arquivo da lista.

### **3. Navegação Entre Páginas**

- Após preencher os campos obrigatórios e anexar os documentos, o botão "Avançar" redireciona o usuário para a próxima página:
  - **`socios.html`**: Cadastro de sócios da empresa.
  - **`bancos.html`**: Cadastro de informações bancárias.

### **4. Armazenamento Local**

- Durante a navegação, os dados são salvos temporariamente no **localStorage**.
- Quando o sistema for integrado com um banco de dados, esses dados serão enviados diretamente ao servidor para persistência.

---

## **Tecnologias Utilizadas**

1. **Frontend:**
   - **HTML5**: Estrutura do site.
   - **CSS3**: Estilos responsivos e design visual.
   - **JavaScript (ES6+)**: Lógica e interatividade do site.

2. **Integrações:**
   - **BrasilAPI**: API pública para consulta de dados de CNPJs.

3. **Armazenamento Temporário:**
   - **localStorage**: Gerenciamento de dados temporários no navegador.

---

## **Melhorias Futuras**

1. **Integração com Banco de Dados:**
   - Persistir informações dos CNPJs, sócios e dados bancários.
   - Usar um backend (Node.js, Django, etc.) para gerenciar a comunicação.

2. **Autenticação de Usuários:**
   - Adicionar login e controle de acesso.

3. **Relatórios e Consultas:**
   - Permitir geração de relatórios com dados cadastrados.
   - Adicionar filtros para busca por CNPJ ou Razão Social.

4. **Validação Avançada:**
   - Validar documentos anexados para garantir que sejam do tipo esperado (PDF, JPG, etc.).

5. **Melhorias de UI/UX:**
   - Implementar alertas e mensagens de sucesso/erro mais claros.

---
