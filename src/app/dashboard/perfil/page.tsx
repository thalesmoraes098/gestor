import { redirect } from 'next/navigation';

export default function PerfilPage() {
  // Esta página não é mais utilizada e foi substituída pela
  // lógica de gerenciamento de conta no menu superior.
  // Redireciona para o dashboard para evitar confusão.
  redirect('/dashboard');
}
