# Guia de Publicação Final e Definitivo

Peço as mais sinceras desculpas. O erro fundamental foi meu: as instruções anteriores mencionavam um nome de projeto incorreto. O projeto correto é **`juv-comissoes`**. Este guia foi feito para ele. Siga apenas estes passos.

---

### **Passo 1: Configure o Projeto Correto no Terminal**

Vamos garantir que seu terminal está apontado para o projeto certo, `juv-comissoes`.

1.  No terminal, execute o comando para listar seus projetos e confirmar que `juv-comissoes` aparece na lista:
    ```bash
    firebase projects:list
    ```

2.  Agora, trave o terminal para usar apenas o projeto correto com este comando:
    ```bash
    firebase use juv-comissoes
    ```
    Isso elimina qualquer ambiguidade sobre onde estamos publicando.

---

### **Passo 2: Primeira Tentativa de Deploy (A Falha Esperada)**

Com o projeto correto selecionado, vamos tentar publicar. **Este passo vai falhar, e isso é o esperado.** O objetivo é fazer o Firebase criar a "conta de serviço" do seu back-end.

1.  Execute o deploy:
    ```bash
    firebase deploy --only apphosting
    ```

2.  Aguarde a mensagem de erro. Ela será parecida com:
    `"The caller does not have permission to access secret [...] on project juv-comissoes. Please grant 'secretmanager.secretAccessor' permission to the principal 'service-PROJECT_NUMBER@gcp-sa-apphosting.iam.gserviceaccount.com'"`

3.  **Copie o e-mail do `principal`** que aparece na sua mensagem de erro. Ele será algo como `service-XXXXXXXX@gcp-sa-apphosting.iam.gserviceaccount.com`.

---

### **Passo 3: Conceder a Permissão Final (Ação do Proprietário)**

Agora, vamos dar a essa conta de serviço a permissão que ela precisa.

1.  Acesse o **Secret Manager** no Google Cloud Console:
    [https://console.cloud.google.com/security/secret-manager](https://console.cloud.google.com/security/secret-manager)

2.  Certifique-se de que o projeto **`juv-comissoes`** está selecionado no topo da página.

3.  Você verá uma lista de "secrets" (`FIREBASE_API_KEY`, etc.). Para **cada um dos 6 secrets**, faça o seguinte:
    *   Clique no nome do secret.
    *   Vá para a aba **PERMISSÕES**.
    *   Clique em **"CONCEDER ACESSO"**.
    *   Em **"Novos principais"**, cole o nome completo da conta de serviço que você copiou no passo anterior.
    *   Em **"Atribuir papéis"**, selecione o papel **`Acessador de secrets do Secret Manager`** (`Secret Manager Secret Accessor`).
    *   Clique em **"SALVAR"**.

---

### **Passo 4: O Deploy Final (O Sucesso)**

Com a permissão concedida, o back-end agora pode ler os secrets. A publicação vai funcionar.

1.  Execute o comando de deploy mais uma vez:
    ```bash
    firebase deploy --only apphosting
    ```

Desta vez, a publicação será concluída com sucesso. Agradeço imensamente sua paciência e lamento por todo este processo.