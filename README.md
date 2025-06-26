# Gestor Digital

## Passos Finais Para Publicação

O código está pronto. Siga **exatamente** estes três passos para publicar.

---

### Passo 1: Iniciar Publicação (Vai falhar)

*   No Firebase, clique para **publicar o projeto**.
*   **Isto vai falhar.** É esperado. O objetivo é apenas criar um novo back-end.

---

### Passo 2: Conceder Permissão ao Novo Back-end

1.  Na mensagem de erro da publicação que falhou, encontre e copie o nome do **principal**. Ele se parece com:
    `service-SEU_NUMERO_DO_PROJETO@gcp-sa-apphosting.iam.gserviceaccount.com`

2.  Vá para o **Secret Manager** no Google Cloud: [Clique aqui](https://console.cloud.google.com/security/secret-manager)

3.  Para **CADA UM** dos 6 secrets (`FIREBASE_API_KEY`, etc.):
    *   Marque a caixa de seleção ao lado do nome do secret.
    *   No painel à direita, clique em **ADICIONAR PRINCIPAL**.
    *   Cole o nome do principal que você copiou no campo "Novos principais".
    *   No campo "Atribuir papel", escolha **Acessador de secrets do Secret Manager**.
    *   Clique em **SALVAR**.

> **ALERTA DE ERRO COMUM:** Se ao salvar você receber um erro dizendo "Os endereços de e-mail e os domínios precisam estar associados...", isso significa que a sua organização do Google Cloud tem uma política de segurança que impede a adição de contas de serviço. Um **Administrador da Organização do Google Cloud** precisa desativar ou ajustar a política "Restringir domínios de membros da política" (`iam.allowedPolicyMemberDomains`) para permitir contas de serviço do Google.

> **Importante:** Repita o passo 3 para **todos os seis** secrets.

---

### Passo 3: Publicar Novamente (Vai funcionar)

*   Volte para o Firebase e clique para **publicar o projeto** mais uma vez.
*   Desta vez, a publicação será concluída com sucesso.
