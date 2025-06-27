'use client';

import * as React from 'react';
import {
  ShieldCheck,
  PlusCircle,
  Settings,
  User,
  PanelLeft,
  Search,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { EquipmentCard } from './equipment-card';
import { AddEquipmentSheet } from './add-equipment-sheet';
import { Logo } from './logo';
import type { Equipment } from '@/lib/types';

const initialEquipment: Equipment[] = [
  {
    id: 'rope-1',
    name: 'Corde d\'escalade dynamique',
    photoUrl: 'https://placehold.co/600x400.png',
    photoAiHint: 'climbing rope',
    purchaseDate: new Date('2022-03-15'),
    lifespanYears: 5,
    description: 'Corde dynamique de 60m pour l\'escalade sportive. Peu utilisée, le week-end.',
    manufacturerData: 'Beal Joker 9.1mm Unicore. Mise au rebut recommandée après 5 ans d\'usage modéré, ou 10 ans au total.',
  },
  {
    id: 'harness-1',
    name: 'Baudrier Arc\'teryx AR-395a',
    photoUrl: 'https://placehold.co/600x400.png',
    photoAiHint: 'climbing harness',
    purchaseDate: new Date('2021-08-01'),
    lifespanYears: 7,
    description: 'Baudrier principal pour toutes les disciplines. Montre une usure mineure sur les pontets.',
    manufacturerData: 'La durée de vie standard d\'un baudrier Arc\'teryx est de 7 ans à partir de la date de fabrication dans des conditions optimales.',
  },
  {
    id: 'carabiner-set-1',
    name: 'Dégaines Black Diamond',
    photoUrl: 'https://placehold.co/600x400.png',
    photoAiHint: 'climbing quickdraws',
    purchaseDate: new Date('2023-01-20'),
    lifespanYears: 10,
    description: 'Jeu de 12 dégaines. Aucune chute majeure.',
    manufacturerData: 'Black Diamond recommande de mettre au rebut les mousquetons après 10 ans, ou immédiatement s\'ils ont subi une chute importante ou présentent des gorges profondes.',
  },
];

export function Dashboard() {
  const [equipment, setEquipment] = React.useState<Equipment[]>(initialEquipment);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const addEquipment = (item: Omit<Equipment, 'id'>) => {
    const newEquipment = { ...item, id: `equip-${Date.now()}` };
    setEquipment(prev => [newEquipment, ...prev]);
    setIsSheetOpen(false);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="size-6" />
              <span className="font-headline text-lg">Gardien d'Équipement</span>
            </a>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <ShieldCheck className="h-4 w-4" />
                Mon Équipement
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </a>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle className="font-headline">Passer à Pro</CardTitle>
                <CardDescription>
                  Débloquez les vérifications illimitées et les fonctions avancées.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Mettre à niveau
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Basculer le menu de navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <a
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Logo className="h-6 w-6" />
                  <span className="font-headline">Gardien d'Équipement</span>
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShieldCheck className="h-5 w-5" />
                  Mon Équipement
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Paramètres
                </a>
              </nav>
               <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">Passer à Pro</CardTitle>
                    <CardDescription>
                      Débloquez toutes les fonctionnalités et obtenez un accès illimité.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Mettre à niveau
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un équipement..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
           <AddEquipmentSheet onSave={addEquipment} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Ajouter un équipement
              </Button>
            </AddEquipmentSheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Basculer le menu utilisateur</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profil</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Déconnexion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Mon Équipement</h1>
             <TooltipProvider>
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                                <LayoutGrid className="size-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Vue grille</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                                <List className="size-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Vue liste</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
          </div>

          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'flex flex-col gap-4'
            }
          >
            {equipment.map(item => (
              <EquipmentCard key={item.id} equipment={item} viewMode={viewMode}/>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
