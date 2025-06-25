# Gestor Digital

Este é um projeto Next.js para gerenciamento de doações, assessores e comissões.

## Próximos Passos Para Publicação

Como o back-end anterior foi excluído, o próximo passo é:

1.  **Tente publicar o projeto novamente.** A publicação irá falhar, mas isso criará um novo back-end no Firebase App Hosting.
2.  **Ajuste as permissões.** Após a falha, vá até o [Secret Manager](https://console.cloud.google.com/security/secret-manager) e conceda ao novo back-end a permissão de **`Acessador de secrets do Secret Manager`** para cada um dos 6 secrets. O nome do principal do novo back-end seguirá o formato `service-SEU_NUMERO_DO_PROJETO@gcp-sa-apphosting.iam.gserviceaccount.com`.
3.  **Publique mais uma vez.** Após ajustar as permissões, a publicação final funcionará.