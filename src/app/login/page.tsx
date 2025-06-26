import { redirect } from 'next/navigation';

export default function LoginPage() {
  // A página de login também redireciona diretamente para o dashboard.
  redirect('/dashboard');
}
