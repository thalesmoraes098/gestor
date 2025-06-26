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

> **Importante:** Repita o passo 3 para **todos os seis** secrets.

---

### Passo 3: Publicar Novamente (Vai funcionar)

*   Volte para o Firebase e clique para **publicar o projeto** mais uma vez.
*   Desta vez, a publicação será concluída com sucesso.
