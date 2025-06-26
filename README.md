# Guia Definitivo para Publicação - SalesVision

Este guia foi revisado e simplificado para garantir uma publicação sem erros. Siga **apenas** estes passos, na ordem exata.

---

### **Contexto do Erro: Permissão de Faturamento vs. Permissão de Projeto**

O erro "você não tem autorização" acontece porque são necessárias **duas permissões diferentes**:
1.  **Permissão de Faturamento:** Para autorizar o Google a cobrar pelos serviços.
2.  **Permissão de Projeto:** Para autorizar sua conta a criar e gerenciar recursos (como o servidor do App Hosting) *dentro* do projeto.

Você já tem a permissão de faturamento, mas a de projeto está faltando.

---

### **Passo 1: Conceder Permissão de Proprietário do Projeto (Ação do Administrador)**

O proprietário do projeto Google Cloud precisa conceder a permissão de `Proprietário` (Owner) à sua conta de usuário.

**Instruções para o Administrador:**

1.  Acesse a página de **IAM e Administração** do Google Cloud Console:
    [https://console.cloud.google.com/iam-admin/iam](https://console.cloud.google.com/iam-admin/iam)

2.  No topo da página, certifique-se de que o projeto **`gestor-digital-4e554`** está selecionado.

3.  Clique no botão **"CONCEDER ACESSO"** (ou "GRANT ACCESS").

4.  No campo **"Novos principais"**, insira o endereço de e-mail do usuário que está tentando publicar (neste caso, `thalesmoraesadv@gmail.com`).

5.  No campo **"Atribuir papéis"**, selecione o papel **`Proprietário`** (em inglês: `Owner`). Este papel concede todas as permissões necessárias para gerenciar o projeto.

6.  Clique em **"SALVAR"**.

> **Nota:** Pode levar alguns minutos para a permissão ser totalmente propagada pelo sistema do Google.

---

### **Passo 2: Habilitar os Serviços no Firebase (Ação do Desenvolvedor)**

Agora que você tem a permissão correta, volte para a página do **Firebase App Hosting**.

1.  Atualize a página.
2.  Clique no botão azul **"Configurar serviços"**. O erro de permissão não deve mais aparecer.

---

### **Passo 3: Executar o Deploy (Ação do Desenvolvedor)**

Com as permissões corretas e os serviços configurados, o próximo passo é executar o comando de deploy no terminal.

1.  Primeiro, faça login com a conta correta no terminal:
    ```bash
    firebase login
    ```
    (Certifique-se de escolher a conta `thalesmoraesadv@gmail.com` no navegador).

2.  Execute o deploy:
    ```bash
    firebase deploy --only apphosting
    ```
    **Importante:** A primeira vez que você executar este comando, **ele provavelmente vai falhar** com um erro sobre permissão para acessar "secrets". Isso é esperado. O objetivo é fazer com que o Firebase crie a conta de serviço do back-end.

---

### **Passo 4: Conceder Permissão aos Secrets (Ação do Administrador)**

A falha no passo anterior cria uma conta de serviço. Agora, o administrador precisa dar a essa conta permissão para ler os secrets.

**Instruções para o Administrador:**

1.  Acesse o **Secret Manager** no Google Cloud Console:
    [https://console.cloud.google.com/security/secret-manager](https://console.cloud.google.com/security/secret-manager)

2.  Na mensagem de erro do deploy, encontre o nome da **conta de serviço**. Será algo como: `service-PROJECT_NUMBER@gcp-sa-apphosting.iam.gserviceaccount.com`.

3.  Para **cada um dos 6 secrets** (`FIREBASE_API_KEY`, etc.), faça o seguinte:
    *   Clique no nome do secret.
    *   Vá para a aba **PERMISSÕES**.
    *   Clique em **"CONCEDER ACESSO"**.
    *   Em **"Novos principais"**, cole o nome completo da conta de serviço.
    *   Em **"Atribuir papéis"**, selecione o papel **`Acessador de secrets do Secret Manager`** (`Secret Manager Secret Accessor`).
    *   Clique em **"SALVAR"**.

---

### **Passo 5: Executar o Deploy Novamente (Ação do Desenvolvedor)**

Agora que tudo está configurado, execute o comando de deploy mais uma vez:

```bash
firebase deploy --only apphosting
```

Desta vez, a publicação será concluída com sucesso.
