# ✅ Sistema de Lista de Tarefas com Autenticação (React + TypeScript + Supabase)

Uma aplicação web para **autenticação de usuários e gerenciamento de tarefas**, permitindo adicionar, editar, remover e consultar tarefas — com **upload opcional de imagens**, integrado ao **Supabase** (Auth, Database e Storage).

---

## 📋 Funcionalidades

✅ Autenticação segura com **Supabase Auth**
✅ CRUD completo de tarefas com **Postgres**
✅ Upload opcional de imagens para o **Storage**
✅ Sessão persistente e gerenciamento automático de login
✅ Listagem filtrada por usuário logado
✅ Interface moderna feita em **React + TypeScript**

---

## 📝 Gerenciamento de Tarefas

📌 Adicionar tarefa com:

* Título
* Descrição
* Upload opcional de imagem

📌 Editar tarefa já existente
📌 Excluir tarefa
📌 Consultar tarefas do usuário autenticado (apenas quando solicitado)
📌 Atualização automática da lista após ações

---

## 🌐 Integração com Supabase

🔐 **RLS (Row Level Security) habilitado**
🎯 Tarefas vinculadas ao e-mail do usuário autenticado
🔑 Endpoints seguros via API Key + JWT
🗃️ Tabela `tasks` configurada com os campos:

* `id`
* `title`
* `description`
* `email`
* `image_url`
* `created_at`

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia                       | Função                           |
| -------------------------------- | -------------------------------- |
| **React + Vite**                 | Interface e estrutura do projeto |
| **TypeScript**                   | Tipagem estática                 |
| **Supabase Auth**                | Login e cadastro de usuários     |
| **Supabase Database (Postgres)** | Armazenamento das tarefas        |
| **Supabase Storage**             | Upload de imagens                |
| **CSS**                          | Estilização das telas            |

---

## ⚙️ Como Usar

### 1️⃣ Instalar dependências

```bash
npm install
```

### 2️⃣ Criar arquivo `.env`

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=chave_publica_aqui
```

### 3️⃣ Rodar o projeto

```bash
npm run dev
```

Acesse:

```
http://localhost:5173
```

---

## 📁 Estrutura de Pastas

```
src/
 ├── App.tsx
 ├── main.tsx
 ├── supabaseClient.ts
 ├── components/
 │     ├── Auth.tsx
 │     └── TaskManager.tsx
 ├── styles/
 │     └── auth.css
```

---

# 🧩 Lógica do Sistema

## ➕ Adicionar tarefa

1. Usuário preenche título e descrição.
2. Se houver imagem → upload para o Storage.
3. Inserção no banco com `insert()`.
4. Campos resetados após envio.

---

## 📝 Editar tarefa

* Formulário preenchido automaticamente.
* Atualização via `update()`.
* Atualiza imagem se houver nova.

---

## 🔍 Consultar tarefas

* Carrega apenas quando o usuário clica no botão.

```ts
supabase.from("tasks")
  .select("*")
  .eq("email", session.user.email)
  .order("created_at", { ascending: false });
```

---

## 🗑️ Excluir tarefa

```ts
supabase
  .from("tasks")
  .delete()
  .eq("id", taskId);
```

---

# 🗄️ Estrutura do Banco (Supabase)

### **Tabela `tasks`**

| Coluna        | Tipo        | Detalhes               |
| ------------- | ----------- | ---------------------- |
| `id`          | uuid (PK)   | gerado automaticamente |
| `title`       | text        | obrigatório            |
| `description` | text        | opcional               |
| `email`       | text        | identifica o usuário   |
| `image_url`   | text        | pode ser nula          |
| `created_at`  | timestamptz | default now()          |

### **Storage**

* Bucket: `tasks-images`
* Upload privado, leitura pública

---

# 🔒 Regras de Segurança (RLS)

```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
```

### Inserção

```sql
CREATE POLICY "Insert own tasks" ON tasks
FOR INSERT WITH CHECK (auth.email() = email);
```

### Leitura

```sql
CREATE POLICY "Read own tasks" ON tasks
FOR SELECT USING (auth.email() = email);
```

### Update/Delete

```sql
CREATE POLICY "Update/Delete own tasks" ON tasks
FOR ALL USING (auth.email() = email);
```

---

# 🖥️ Interface

## 🔐 Tela de Login

✔ Layout centralizado
✔ Responsiva
✔ Alterna automaticamente conforme autenticação

## 📄 Tela de Tarefas

✔ Formulário de inserção
✔ Botão "Consultar tarefas"
✔ Listagem do usuário logado
✔ Botões de **Editar** e **Excluir**
✔ Visualização da imagem, se existir

---

# 👨‍💻 Autor

**Guilherme Guimarães**
Projeto desenvolvido para fins educacionais e demonstração de integração moderna entre *React*, *TypeScript* e *Supabase*.
