import { redirect } from 'next/navigation';

export default function LoginPage() {
  // A página de login agora é a página principal.
  // Redireciona para a raiz para evitar conteúdo duplicado.
  redirect('/');
}
