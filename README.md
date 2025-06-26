# Guia de Publicação - SalesVision Dashboard

Este guia descreve os passos necessários para publicar o aplicativo no Firebase App Hosting.

---

### **Passo 1: Configurar Permissões de Faturamento (Ação do Administrador)**

O primeiro erro comum ocorre porque sua conta de usuário precisa de permissão para habilitar serviços que podem gerar custos. Um administrador da conta de faturamento do Google Cloud precisa conceder essa permissão.

**Instruções para o Administrador:**

1.  Acesse a seção de **Faturamento** do Google Cloud Console através deste link:
    [https://console.cloud.google.com/billing](https://console.cloud.google.com/billing)

2.  Selecione a conta de faturamento correta para este projeto (o ID da conta de faturamento geralmente aparece na mensagem de erro no console do Firebase).

3.  No menu à direita, encontre o painel de **Permissões** (ou "INFO PANEL"). Se ele não estiver visível, clique em **"MOSTRAR PAINEL DE INFORMAÇÕES"**.

4.  Clique em **"ADICIONAR PRINCIPAL"**.

5.  No campo **"Novos principais"**, insira o endereço de e-mail do usuário que está tentando fazer a publicação.

6.  No campo **"Atribuir papéis"**, selecione o papel **`Usuário da conta de faturamento`** (em inglês: `Billing Account User`).

7.  Clique em **"SALVAR"**.

Após o administrador concluir estes passos, o usuário poderá prosseguir com a publicação.

---

### **Passo 2: Executar o Deploy (Ação do Desenvolvedor)**

Com as permissões de faturamento corretas, o próximo passo é executar o comando de deploy no terminal, na pasta do projeto.

Execute o seguinte comando:

```bash
firebase deploy --only apphosting
```

**Importante:** A primeira vez que você executar este comando, **ele provavelmente vai falhar** com um erro sobre permissão para acessar "secrets". Isso é esperado. O objetivo é fazer com que o Firebase crie o serviço de back-end.

---

### **Passo 3: Conceder Permissão aos Secrets (Ação do Administrador)**

A falha no passo anterior cria uma conta de serviço para o seu aplicativo. Agora, o administrador precisa dar a essa conta permissão para ler as credenciais.

**Instruções para o Administrador:**

1.  Acesse o **Secret Manager** no Google Cloud Console:
    [https://console.cloud.google.com/security/secret-manager](https://console.cloud.google.com/security/secret-manager)

2.  Encontre o nome da **conta de serviço** na mensagem de erro do deploy. Será algo como: `service-PROJECT_NUMBER@gcp-sa-apphosting.iam.gserviceaccount.com`.

3.  Para **cada um dos 6 secrets** (`FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, etc.), faça o seguinte:
    *   Clique no nome do secret.
    *   Vá para a aba **PERMISSÕES**.
    *   Clique em **"CONCEDER ACESSO"**.
    *   Em **"Novos principais"**, cole o nome completo da conta de serviço do passo 2.
    *   Em **"Atribuir papéis"**, selecione o papel **`Acessador de secrets do Secret Manager`** (em inglês: `Secret Manager Secret Accessor`).
    *   Clique em **"SALVAR"**.

---

### **Passo 4: Executar o Deploy Novamente (Ação do Desenvolvedor)**

Agora que a conta de serviço tem as permissões corretas, execute o comando de deploy mais uma vez:

```bash
firebase deploy --only apphosting
```

Desta vez, a publicação será concluída com sucesso.
