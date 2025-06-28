'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signup } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/gear-guardian/logo';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Formulaire d'inscription
export function Signup() {
  const router = useRouter();
  const { toast } = useToast();
  // Indique si l'appel API est en cours
  const [isLoading, setIsLoading] = React.useState(false);

  // Envoi du formulaire d'inscription
  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
      toast({
        variant: 'destructive',
        title: 'Champs manquants',
        description: 'Veuillez remplir tous les champs.',
      });
      setIsLoading(false);
      return;
    }

    try {
      await signup(name, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      const data = error.response?.data;
      let description = "Une erreur est survenue. Veuillez réessayer.";
      if (data?.error) {
        // Cas : BusinessException ou ConstraintViolationException
        description = data.error;
      } else if (data && typeof data === 'object') {
        // Cas : validation multiple
        const messages = Object.values(data);
        description = messages.join(', ');
      }

      toast({
        variant: 'destructive',
        title: "Erreur d'inscription",
        description,
      });

      setIsLoading(false);
    }
  };

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
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom d'utilisateur</Label>
                <Input id="name" name="name" placeholder="nom d'utilisateur" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="nom@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer un compte
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Vous avez déjà un compte?{' '}
            <Link href="/login" className="underline">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Signup;
