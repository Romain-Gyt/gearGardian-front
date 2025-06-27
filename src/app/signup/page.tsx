import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/gear-guardian/logo';
import { redirect } from 'next/navigation';

export default function SignupPage() {

  const handleSignup = async (formData: FormData) => {
    'use server';
    // La logique de création d'utilisateur réelle se trouverait ici.
    // Pour l'instant, nous redirigeons simplement vers le tableau de bord.
    redirect('/dashboard');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                <Logo className="size-8" />
                <h1 className="text-2xl font-headline">GearGuardian</h1>
            </div>
          <CardTitle className="text-2xl">Inscription</CardTitle>
          <CardDescription>Créez un compte pour commencer à gérer votre équipement.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSignup}>
            <div className="grid gap-4">
                <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" name="name" placeholder="Prénom Nom" required />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="nom@exemple.com" required />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                Créer un compte
                </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Vous avez déjà un compte?{' '}
            <Link href="/" className="underline">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
