# PsithaisRodrigues — Site Psicologia e Neuropsicologia

## 🚀 Como fazer deploy no Vercel

### 1. Crie um repositório no GitHub

1. Acesse [github.com](https://github.com) e crie um novo repositório (público ou privado)
2. Dê o nome de `psithaisrodrigues` (ou qualquer nome que preferir)
3. Não inicialize com README (já temos um aqui)

### 2. Envie os arquivos para o GitHub

No terminal, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/psithaisrodrigues.git
git push -u origin main
```

Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub.

### 3. Conecte ao Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Importe o repositório `psithaisrodrigues`
4. O Vercel detecta automaticamente que é um projeto Node.js
5. Clique em **"Deploy"**

### 4. Configure as variáveis de ambiente (importante!)

No painel do Vercel, vá em **Settings → Environment Variables** e adicione:

| Chave | Valor |
|-------|-------|
| `BLOG_USER` | `Thais Rodrigues` |
| `BLOG_PASSWORD` | `sua_senha_aqui` |

> Por padrão, o usuário é `Thais Rodrigues` e a senha é `123456`. Recomendo alterar a senha para algo mais seguro.

### 5. Pronto!

Seu site estará online em algo como:
`https://psithaisrodrigues.vercel.app`

O blog estará em:
`https://psithaisrodrigues.vercel.app/#blog`

---

## 📁 O que está incluído no deploy

- `index.html` — site principal (inclui blog, e-books, contato, etc.)
- `style.css` e `modern.css` — estilos
- `script.js` — lógica do blog (busca, filtros, curtidas, etc.)
- `server.js` — servidor Express com API do blog
- `posts.json` — posts do blog
- `comments.json` — comentários do blog
- `uploads/` — imagens enviadas pelos posts
- `triagem-pix.html` e `triagem-pix.js` — página de triagens
- Imagens: logos, fotos, etc.

---

## 🔐 Área da criadora (blog)

- Usuário padrão: `Thais Rodrigues`
- Senha padrão: `123456` (altere via variável de ambiente `BLOG_PASSWORD`)

## ⚠️ Observações

- O Vercel é **serverless**, então o servidor não fica rodando 24/7 da forma tradicional. Cada requisição ativa uma função serverless.
- Uploads de imagens funcionam, mas em ambiente serverless os arquivos podem não persistir entre reinicializações (depende do plano). Para produção com muitos uploads, considere usar um serviço externo de armazenamento (ex: Cloudinary, AWS S3).
