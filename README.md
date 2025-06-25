# Gestor Digital - Sistema de Gestão

Este é um sistema de gestão completo construído com Next.js, Firebase e ShadCN UI. Ele está pronto para ser publicado e utilizado em um ambiente de produção.

## Próximos Passos para Publicação

Para que a aplicação funcione, você precisa conectá-la a um projeto Firebase. Siga os passos abaixo.

### 1. Crie um Projeto no Firebase

Se você ainda não tem um projeto Firebase, crie um gratuitamente:

1.  Acesse o [Console do Firebase](https://console.firebase.google.com/).
2.  Clique em **"Adicionar projeto"** e siga as instruções na tela.

### 2. Ative os Serviços Necessários

No menu lateral do seu projeto Firebase, ative os seguintes serviços:

*   **Firestore Database:**
    1.  Vá para **Build > Firestore Database**.
    2.  Clique em **"Criar banco de dados"**.
    3.  Inicie no **modo de produção** e escolha a localização do servidor.
    4.  **Importante:** Vá para a aba **"Regras"** e atualize as regras para permitir leitura e escrita (para desenvolvimento inicial, você pode usar as regras abaixo, mas para produção, restrinja o acesso conforme necessário):
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /{document=**} {
              allow read, write: if true; // CUIDADO: Permite acesso total
            }
          }
        }
        ```

*   **Storage:**
    1.  Vá para **Build > Storage**.
    2.  Clique em **"Começar"** e siga as instruções para configurar no modo de produção.
    3.  **Importante:** Vá para a aba **"Regras"** e atualize as regras de forma semelhante ao Firestore:
        ```
        rules_version = '2';
        service firebase.storage {
          match /b/{bucket}/o {
            match /{allPaths=**} {
              allow read, write: if true; // CUIDADO: Permite acesso total
            }
          }
        }
        ```

*   **Authentication:**
    1.  Vá para **Build > Authentication**.
    2.  Clique em **"Começar"**.
    3.  Por enquanto, nenhuma configuração adicional é necessária aqui, mas o serviço precisa estar ativo.

### 3. Obtenha as Credenciais do Firebase

Você precisa das chaves de configuração para que seu aplicativo Next.js possa se comunicar com o Firebase.

1.  No Console do Firebase, vá para **Configurações do Projeto** (ícone de engrenagem no canto superior esquerdo).
2.  Na aba **"Geral"**, role para baixo até a seção **"Seus apps"**.
3.  Clique no ícone **</>** para adicionar um aplicativo Web.
4.  Dê um nome ao seu aplicativo (ex: "Meu Gestor Digital") e clique em **"Registrar aplicativo"**.
5.  O Firebase exibirá um objeto de configuração `firebaseConfig`. **Copie este objeto inteiro.**

    Ele se parecerá com isto:
    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "seu-projeto.firebaseapp.com",
      projectId: "seu-projeto",
      storageBucket: "seu-projeto.appspot.com",
      messagingSenderId: "123...",
      appId: "1:123...:web:..."
    };
    ```

### 4. Configure as Variáveis de Ambiente (Secrets)

Esta é a etapa final e mais importante. Você precisa fornecer suas credenciais do Firebase de forma segura para a sua aplicação. Faremos isso criando "Secrets".

1.  **Acesse a Página do seu Back-end:**
    *   No Console do Firebase, vá para **Build > App Hosting**.
    *   Clique no card do seu back-end (chamado **gestor**).

2.  **Vá para a Seção de Secrets:**
    *   Na página de detalhes do back-end, clique na aba **Configurações**.
    *   No menu à esquerda, clique em **Ambiente**.

3.  **Crie os Secrets Manualmente:**
    *   Você verá um botão **"Adicionar secret"**. Clique nele.
    *   Um pop-up aparecerá pedindo um **Nome** e um **Valor** para o secret.
    *   Agora, crie os 6 secrets um por um, usando a tabela abaixo como referência. Copie o **Nome do Secret** exatamente como está na tabela e cole o **Valor** correspondente do seu objeto `firebaseConfig`.

    **Tabela de Secrets:**

    | Nome do Secret (para criar no Firebase) | Valor (do seu `firebaseConfig`)     |
    | ------------------------------------- | ----------------------------------- |
    | `FIREBASE_API_KEY`                    | O valor da sua chave `apiKey`           |
    | `FIREBASE_AUTH_DOMAIN`                | O valor da sua chave `authDomain`       |
    | `FIREBASE_PROJECT_ID`                 | O valor da sua chave `projectId`        |
    | `FIREBASE_STORAGE_BUCKET`             | O valor da sua chave `storageBucket`    |
    | `FIREBASE_MESSAGING_SENDER_ID`        | O valor da sua chave `messagingSenderId`|
    | `FIREBASE_APP_ID`                     | O valor da sua chave `appId`            |

    *   **Exemplo para o primeiro secret:**
        *   Nome do Secret: `FIREBASE_API_KEY`
        *   Valor do Secret: `AIza...` (cole sua chave aqui)
        *   Clique em "Salvar".

    *   Repita o processo clicando em "Adicionar secret" novamente para os outros 5 itens da tabela.

4.  **Verifique a Lista:**
    *   Após salvar todos os 6, você verá a lista completa de secrets na tela.

Com isso, sua aplicação estará 100% configurada e pronta para ser publicada. O arquivo `apphosting.yaml` no seu código já está preparado para usar esses secrets que você acabou de criar.
