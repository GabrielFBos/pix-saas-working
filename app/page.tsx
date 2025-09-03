import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redireciona para a página de pré-cadastro
  redirect('/pre-cadastro');
}
