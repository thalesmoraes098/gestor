import { redirect } from 'next/navigation';

export default function HomePage() {
  // A página inicial agora redireciona diretamente para o dashboard.
  redirect('/dashboard');
}
