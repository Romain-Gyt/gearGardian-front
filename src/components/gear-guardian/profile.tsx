'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, updateProfile, logout } from '@/lib/api/';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { Logo } from '@/components/gear-guardian/logo';
import { ModeToggle } from '@/components/mode-toggle';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile } from '@/lib/types';

// Affiche et édite les informations utilisateur
export function Profile() {
  const router = useRouter();
  const { toast } = useToast();

  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Préférences de notification
  const [notificationThreshold, setNotificationThreshold] = React.useState(80);
  const [emailNotifications, setEmailNotifications] = React.useState(true);

  // Chargement du profil à l'affichage
  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    getProfile()
      .then((data) => {
        setProfile(data);
        if (data.alertThreshold !== undefined) {
          setNotificationThreshold(data.alertThreshold);
        }
        setIsLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    logout();
    router.push('/login');
  };

  // Enregistrement des infos personnelles
  const handleProfileSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;
    const formData = new FormData(e.currentTarget);
    const newName = formData.get('name') as string;

    try {
      const updated = await updateProfile({ name: newName });
      setProfile(updated);
      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations personnelles ont été enregistrées.',
      });
    } catch {
      toast({ variant: 'destructive', title: 'Erreur', description: 'La mise à jour a échoué.' });
    }
  };

  // Simule la mise à jour du mot de passe
  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Fonctionnalité à venir',
      description: 'La mise à jour du mot de passe sera bientôt disponible.',
    });
  };

  // Sauvegarde des préférences de notifications
  const handleNotificationSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const updated = await updateProfile({ alertThreshold: notificationThreshold });
      setProfile(updated);
      toast({
        title: 'Préférences enregistrées',
        description: 'Vos paramètres de notification ont été mis à jour.',
      });
    } catch {
      toast({ variant: 'destructive', title: 'Erreur', description: 'La mise à jour a échoué.' });
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
              <Logo className="h-6 w-6" />
              <span className="sr-only">GearGuardian</span>
            </Link>
            <Skeleton className="h-4 w-24" />
          </nav>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
          <div className="mx-auto grid w-full max-w-4xl gap-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-56 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Logo className="h-6 w-6" />
            <span className="sr-only">GearGuardian</span>
          </Link>
          <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
            Tableau de bord
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial" />
          <ModeToggle />
          <Button variant="outline" onClick={handleLogout}>Déconnexion</Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-4xl gap-2">
          <h1 className="text-3xl font-semibold font-headline">Mon Profil</h1>
        </div>
        <div className="mx-auto grid w-full max-w-4xl items-start gap-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Mettez à jour votre nom et votre adresse e-mail.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4" onSubmit={handleProfileSave}>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${profile.name}`} alt="Avatar" />
                      <AvatarFallback>{profile.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" type="button">Changer la photo</Button>
                  </div>
                  <Input name="name" placeholder="Nom complet" defaultValue={profile.name} />
                  <Input type="email" placeholder="Email" defaultValue={profile.email} disabled />
                  <Button type="submit" className="w-fit">Enregistrer</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
                <CardDescription>Il est recommandé d'utiliser un mot de passe long et unique.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4" onSubmit={handlePasswordSave}>
                  <Input placeholder="Mot de passe actuel" type="password" />
                  <Input placeholder="Nouveau mot de passe" type="password" />
                  <Input placeholder="Confirmer le nouveau mot de passe" type="password" />
                  <Button type="submit" className="w-fit">Mettre à jour le mot de passe</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Gérez quand et comment vous recevez des alertes sur votre équipement.</CardDescription>
              </CardHeader>
              <form onSubmit={handleNotificationSave}>
                <CardContent className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="threshold">Seuil d'alerte avant fin de vie</Label>
                    <div className="flex items-center gap-4 pt-2">
                      <Slider
                        id="threshold"
                        value={[notificationThreshold]}
                        onValueChange={(value) => setNotificationThreshold(value[0])}
                        max={100}
                        step={5}
                      />
                      <span className="w-16 text-right font-mono text-lg">{notificationThreshold}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Recevoir une notification quand la durée de vie utilisée atteint ce pourcentage.</p>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications" className="text-base">Notifications par e-mail</Label>
                      <p className="text-xs text-muted-foreground">Recevoir des rappels d'expiration et des alertes de sécurité par e-mail.</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      aria-label="Activer les notifications par e-mail"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-fit">Enregistrer les préférences</Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
