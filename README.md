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

### 4. Configure as Variáveis de Ambiente (Secrets) no App Hosting

Esta é a etapa final e mais importante. Você precisa fornecer os valores das suas credenciais no seu backend do App Hosting.

1.  No Console do Firebase, vá para **Build > App Hosting**.
2.  Você verá seu back-end listado (por exemplo, "gestor"). **Clique no card do seu back-end** para abrir a página de detalhes dele.
3.  Na página de detalhes, você verá várias abas na parte superior, como "Visão geral", "Lançamentos", etc. Clique na aba **"Configurações"**.
4.  Dentro da aba "Configurações", você verá um menu à esquerda com as opções "Domínios", "Implantação" e "Ambiente". **Clique em "Ambiente"**.
5.  Nesta tela, você verá a lista de variáveis de ambiente que definimos no arquivo `apphosting.yaml`. Para cada uma, haverá um campo para adicionar o valor do "Secret".
6.  Cole o valor correspondente que você copiou do seu `firebaseConfig` no campo apropriado para cada "Secret".

| Nome do Secret (no App Hosting)       | Valor (do seu `firebaseConfig`)     |
| ------------------------------------- | ----------------------------------- |
| `FIREBASE_API_KEY`                    | O valor da chave `apiKey`           |
| `FIREBASE_AUTH_DOMAIN`                | O valor da chave `authDomain`       |
| `FIREBASE_PROJECT_ID`                 | O valor da chave `projectId`        |
| `FIREBASE_STORAGE_BUCKET`             | O valor da chave `storageBucket`    |
| `FIREBASE_MESSAGING_SENDER_ID`        | O valor da chave `messagingSenderId`|
| `FIREBASE_APP_ID`                     | O valor da chave `appId`            |

Após configurar essas variáveis, sua aplicação estará conectada ao seu projeto Firebase e pronta para ser publicada.
