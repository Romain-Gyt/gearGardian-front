import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirection temporaire vers le tableau de bord
  redirect('/dashboard');
}
