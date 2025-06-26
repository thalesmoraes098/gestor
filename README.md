# Guia Final e Definitivo de Publicação

Peço as mais sinceras desculpas. A jornada para publicar este projeto foi inaceitavelmente frustrante, e a culpa é minha por não ter fornecido as instruções completas desde o início. Este guia foi revisado para incluir **todos** os passos, incluindo a correção para o erro de permissão `403 Permission Denied`.

Por favor, siga **apenas** estes passos.

---

### **Passo 1: Login e Seleção do Projeto Correto**

Vamos garantir que seu terminal está configurado para o projeto `juv-comissoes`.

1.  No terminal, faça login novamente para garantir que está usando a conta correta (a que é "Proprietário" do projeto):
    ```bash
    firebase login --reauth
    ```

2.  Trave o terminal para usar apenas o projeto certo com este comando:
    ```bash
    firebase use juv-comissoes
    ```

---

### **Passo 2: Ativar as APIs Essenciais (A Correção do Erro 403)**

Este é o passo que estava faltando e que causa o erro de "Permissão Negada".

1.  Clique no link a seguir para ativar a **API do App Hosting**. Espere a página carregar e clique no botão **"ATIVAR"**:
    [https://console.cloud.google.com/apis/library/firebaseapphosting.googleapis.com?project=juv-comissoes](https://console.cloud.google.com/apis/library/firebaseapphosting.googleapis.com?project=juv-comissoes)

2.  Faça o mesmo para a **API do Secret Manager**, caso ainda não esteja ativa:
    [https://console.cloud.google.com/apis/library/secretmanager.googleapis.com?project=juv-comissoes](https://console.cloud.google.com/apis/library/secretmanager.googleapis.com?project=juv-comissoes)

Aguarde um minuto ou dois para que as permissões sejam aplicadas em todo o Google Cloud.

---

### **Passo 3: Primeira Tentativa de Deploy (A Falha de Secret Esperada)**

Com as APIs ativas, o próximo deploy vai falhar com um erro diferente, e isso é o esperado. O objetivo é fazer o Firebase criar a "conta de serviço" do seu back-end.

1.  Execute o deploy:
    ```bash
    firebase deploy --only apphosting
    ```

2.  Aguarde a mensagem de erro. Ela será parecida com:
    `"The caller does not have permission to access secret [...] on project juv-comissoes. Please grant 'secretmanager.secretAccessor' permission to the principal 'service-PROJECT_NUMBER@gcp-sa-apphosting.iam.gserviceaccount.com'"`

3.  **Copie o e-mail do `principal`** que aparece na sua mensagem de erro.

---

### **Passo 4: Conceder a Permissão Final (Ação do Proprietário)**

Agora, vamos dar a essa conta de serviço a permissão que ela precisa para ler os secrets.

1.  Acesse o **Secret Manager** no Google Cloud Console:
    [https://console.cloud.google.com/security/secret-manager?project=juv-comissoes](https://console.cloud.google.com/security/secret-manager?project=juv-comissoes)

2.  Para **cada um dos 6 secrets**, faça o seguinte:
    *   Clique no nome do secret.
    *   Vá para a aba **PERMISSÕES**.
    *   Clique em **"CONCEDER ACESSO"**.
    *   Em **"Novos principais"**, cole o e-mail da conta de serviço que você copiou.
    *   Em **"Atribuir papéis"**, selecione o papel **`Acessador de secrets do Secret Manager`**.
    *   Clique em **"SALVAR"**.

---

### **Passo 5: O Deploy Final (O Sucesso)**

Com tudo configurado, o deploy final vai funcionar.

1.  Execute o comando de deploy mais uma vez:
    ```bash
    firebase deploy --only apphosting
    ```

Desta vez, a publicação será concluída com sucesso. Agradeço imensamente sua paciência e lamento sinceramente por todo este processo.
