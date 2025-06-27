# Gestor Digital

Este é um guia para configurar, executar e fazer o deploy do projeto.

---

### **Como Atualizar o Repositório no GitHub (Resolvendo Erro de Autenticação)**

Se você receber um erro de `Authentication failed` ao tentar executar `git push`, siga estes passos. O terminal precisa de uma maneira segura para se autenticar com o GitHub.

**Passo 1: Crie um Personal Access Token (PAT) no GitHub**

1.  Vá para a página de criação de tokens no GitHub: **[https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)**
2.  **Note (Nota):** Dê um nome ao seu token, por exemplo, `firebase-studio-token`.
3.  **Expiration (Validade):** Escolha a validade que preferir (30 dias é um bom começo).
4.  **Select scopes (Selecione os escopos):** Marque a caixa de seleção ao lado de **`repo`**. Isso dá ao token permissão para acessar seus repositórios.
5.  Clique em **Generate token (Gerar token)** no final da página.
6.  **IMPORTANTE:** Copie o token gerado (começa com `ghp_...`) imediatamente e salve-o em um local seguro. **Você não verá este token novamente.**

**Passo 2: Configure o Git para Usar seu Novo Token**

Volte ao terminal do Firebase Studio e execute o seguinte comando. Substitua `<SEU_USUARIO>` pelo seu nome de usuário do GitHub e `<SEU_TOKEN>` pelo token que você acabou de copiar.

```bash
git remote set-url origin https://thalesmoraes098:<SEU_TOKEN>@github.com/thalesmoraes098/gestor.git
```

*Exemplo:*
Se seu token for `ghp_12345ABCDE`, o comando será:
`git remote set-url origin https://thalesmoraes098:ghp_12345ABCDE@github.com/thalesmoraes098/gestor.git`

**Passo 3: Envie seu Código (Push)**

Agora, o Git está autenticado. Execute o `git push` novamente. Ele deve funcionar.

```bash
git push
```
