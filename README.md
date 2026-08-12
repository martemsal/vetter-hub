# 🏢 Vetter Hub • Gestão Imobiliária & Drive

Interface moderna, rápida e responsiva (com foco mobile/celular) para consulta de arquivos, plantas baixas cotadas, tabelas de vendas, books de apresentação e pastas do Google Drive dos empreendimentos **Vetter**.

---

## 📱 Recursos Principais

- ⚡ **Mobile-First & PWA Ready:** Navegação fluida estilo app nativo com barra inferior fixa e modais deslizantes.
- 📂 **Google Drive Integrado:** Links diretos com 1 toque para a pasta raiz e pastas de materiais de cada empreendimento.
- 📐 **Leitor de Plantas & Cotas:** Visualizador arquitetônico com zoom e tabela detalhada de dimensões de cômodos (largura x comprimento e área útil).
- 💬 **Assistente Agêntico IA:** Consulta rápida a dados de projetos, suítes, vagas e comparativos técnicos.
- 📲 **Compartilhamento WhatsApp:** Geração instantânea de mensagens comerciais formatadas com links dos materiais para envio a clientes.

---

## 🚀 Como Subir para o GitHub e Fazer Deploy na Vercel

### 1. Enviar para o GitHub

1. No terminal do projeto, inicialize o Git (caso ainda não tenha feito):
   ```bash
   git init
   git add .
   git commit -m "feat: interface mobile-first Vetter Hub"
   ```

2. Crie um novo repositório no seu GitHub (ex: `vetter-hub`) e rode os comandos indicados:
   ```bash
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/vetter-hub.git
   git push -u origin main
   ```

---

### 2. Deploy na Vercel (Gratuito e Automático)

#### Opção A: Conectando pelo painel da Vercel (Recomendado)
1. Acesse [vercel.com](https://vercel.com) e faça login com seu GitHub.
2. Clique em **"Add New..."** -> **"Project"**.
3. Selecione o repositório **`vetter-hub`** que você acabou de subir.
4. O framework **Vite** será detectado automaticamente.
5. Clique em **"Deploy"**.
6. Em menos de 1 minuto seu link estará no ar (ex: `https://vetter-hub.vercel.app`).

#### Opção B: Via Terminal com Vercel CLI
```bash
npm i -g vercel
vercel
```

---

### 3. Como Acessar como App no Celular

Assim que o site estiver publicado na Vercel:
- **No iPhone (Safari):** Abra o link, toque no botão de compartilhar (quadrado com seta para cima) e selecione **"Adicionar à Tela de Início"**.
- **No Android (Chrome):** Abra o link, toque no menu de 3 pontinhos e selecione **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.

---

## 💻 Rodando Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse em `http://localhost:3000`.
