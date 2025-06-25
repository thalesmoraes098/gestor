# Gestor Digital - Guia de Publicação e Solução de Problemas

Se você está lendo isto, é provável que tenha encontrado dificuldades na publicação, especialmente com erros relacionados a "Secrets". Peço desculpas pela frustração. Este guia foi reescrito para ser uma lista de verificação final e resolver o problema.

O erro "Secret configurado incorretamente" ou falhas de permissão quase sempre se resumem a um único problema: o serviço do App Hosting (o "back-end") não tem a permissão necessária para *ler* as credenciais que você criou no Secret Manager.

Vamos verificar e corrigir isso.

---

## Passo 1: Confirme suas Credenciais do Firebase

Antes de tudo, tenha certeza de que você tem o objeto `firebaseConfig` correto.

1.  Vá para as **Configurações do Projeto** no [Console do Firebase](https://console.firebase.google.com/).
2.  Na aba **Geral**, encontre o seu aplicativo Web.
3.  Copie o objeto `firebaseConfig`. Você precisará dos valores dele em breve.

---

## Passo 2: Verificação Final das Permissões (O Passo Mais Importante)

Siga estes passos com atenção. Um pequeno detalhe pode ser a causa do problema.

### 2a. Encontre o Nome Exato do "Principal"

Este é o nome da conta de serviço do App Hosting que precisa da permissão.

1.  Vá para a [Página inicial do Google Cloud Console](https://console.cloud.google.com/home/dashboard).
2.  No card **"Informações do projeto"**, encontre e copie o **Número do projeto**.
3.  O nome completo do principal é: `service-SEU_NUMERO_DO_PROJETO@gcp-sa-apphosting.iam.gserviceaccount.com`.
    *   **Substitua `SEU_NUMERO_DO_PROJETO`** pelo número que você acabou de copiar.
    *   Guarde este nome completo. Ele é crucial.

### 2b. Verifique a Permissão em um Secret

Não precisamos verificar todos os seis. Se um estiver correto, os outros provavelmente também estarão.

1.  Vá para a página do [Secret Manager no Google Cloud Console](https://console.cloud.google.com/security/secret-manager). (Certifique-se de que o projeto correto está selecionado no topo).
2.  Na lista de secrets, **clique no NOME** do secret `FIREBASE_API_KEY`. (Não marque a caixa, clique no link do nome).
3.  Você irá para a página de "Detalhes do secret". No menu que aparece à direita (ou no topo), clique em **PERMISSÕES**.
4.  **VERIFICAÇÃO CRUCIAL:**
    *   Olhe a tabela de "Principais".
    *   Na coluna "Principal", você **DEVE** ver o nome completo que você montou no passo 2a (`service-NUMERO...@gcp-sa-apphosting.iam.gserviceaccount.com`).
    *   Na mesma linha, na coluna "Papel(éis)", você **DEVE** ver o papel **`Acessador de secrets do Secret Manager`**.

**Se a linha com o principal e o papel correto NÃO estiver lá:**
*   Isso é a causa do problema.
*   No painel de permissões, clique em **CONCEDER ACESSO**.
*   No campo **"Novos principais"**, cole o nome completo da conta de serviço.
*   No campo **"Selecionar um papel"**, procure e selecione **Secret Manager > Acessador de secrets do Secret Manager**.
*   Clique em **Salvar**.
*   **IMPORTANTE:** Você precisa repetir este processo para **CADA UM DOS 6 SECRETS**.

Depois de confirmar que as permissões estão corretas para todos os 6 secrets, aguarde um minuto e tente publicar novamente.

---

## Se Tudo Falhar: Plano B (Recriar o Back-end)

Às vezes, o estado de um serviço na nuvem pode ficar "preso" ou inconsistente. Se você tem 100% de certeza de que as permissões estão corretas, mas a publicação ainda falha, a solução mais limpa é recriar o back-end.

1.  **Exclua o Back-end:**
    *   Vá para a página do [App Hosting no Console do Firebase](https://console.firebase.google.com/).
    *   Selecione o back-end `gestor`.
    *   Clique no menu de três pontos (⋮) ao lado do nome e selecione **"Excluir back-end"**.

2.  **Tente Publicar Novamente:**
    *   Volte ao seu ambiente de desenvolvimento.
    *   Execute o comando de publicação novamente.
    *   O Firebase irá recriar o back-end do zero, o que geralmente limpa qualquer estado problemático. Você precisará conceder as permissões de acesso aos secrets novamente para o novo back-end, como descrito no Passo 2.

Agradeço imensamente a sua paciência para resolvermos isso.