'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { Logo } from "@/components/gear-guardian/logo";
import { ModeToggle } from "@/components/mode-toggle";

export default function ProfilePage() {
  const [notificationThreshold, setNotificationThreshold] = React.useState(80);
  const [emailNotifications, setEmailNotifications] = React.useState(true);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
       <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                    <Logo className="h-6 w-6" />
                    <span className="sr-only">GearGuardian</span>
                </Link>
                <Link
                    href="/dashboard"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    Tableau de bord
                </Link>
            </nav>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="ml-auto flex-1 sm:flex-initial">
                    {/* Placeholder for potential search or actions */}
                </div>
                <ModeToggle />
                <Link href="/dashboard">
                    <Button variant="outline">Retour au tableau de bord</Button>
                </Link>
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
                <CardDescription>
                  Mettez à jour votre nom et votre adresse e-mail.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4">
                  <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="https://placehold.co/100x100.png" alt="Avatar" data-ai-hint="person portrait"/>
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <Button variant="outline">Changer la photo</Button>
                    </div>
                  <Input placeholder="Prénom" defaultValue="John" />
                  <Input placeholder="Nom" defaultValue="Doe" />
                  <Input type="email" placeholder="Email" defaultValue="john.doe@example.com" />
                  <Button type="submit" className="w-fit">Enregistrer</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
                <CardDescription>
                  Il est recommandé d'utiliser un mot de passe long et unique.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <form className="grid gap-4">
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
                <CardDescription>
                  Gérez quand et comment vous recevez des alertes sur votre équipement.
                </CardDescription>
              </CardHeader>
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
                  <p className="text-xs text-muted-foreground">
                    Recevoir une notification quand la durée de vie utilisée atteint ce pourcentage.
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-base">Notifications par e-mail</Label>
                    <p className="text-xs text-muted-foreground">
                      Recevoir des rappels d'expiration et des alertes de sécurité par e-mail.
                    </p>
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
                 <Button className="w-fit">Enregistrer les préférences</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
