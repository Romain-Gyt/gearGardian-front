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
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const initialEquipment: Equipment[] = [
  {
    id: 'rope-1',
    name: 'Dynamic Climbing Rope',
    photoUrl: 'https://placehold.co/600x400.png',
    photoAiHint: 'climbing rope',
    purchaseDate: new Date('2022-03-15'),
    lifespanYears: 5,
    description: 'A 60m dynamic rope used for sport climbing. Lightly used on weekends.',
    manufacturerData: 'Beal Joker 9.1mm Unicore. Recommended retirement after 5 years of moderate use, or 10 years total.',
  },
  {
    id: 'harness-1',
    name: 'Arc\'teryx AR-395a',
    photoUrl: 'https://placehold.co/600x400.png',
    photoAiHint: 'climbing harness',
    purchaseDate: new Date('2021-08-01'),
    lifespanYears: 7,
    description: 'Main climbing harness for all disciplines. Shows minor wear on tie-in points.',
    manufacturerData: 'Arc\'teryx standard harness lifespan is 7 years from date of manufacture under optimal conditions.',
  },
  {
    id: 'carabiner-set-1',
    name: 'Black Diamond Quickdraws',
    photoUrl: 'https://placehold.co/600x400.png',
    photoAiHint: 'climbing quickdraws',
    purchaseDate: new Date('2023-01-20'),
    lifespanYears: 10,
    description: 'Set of 12 quickdraws. No major falls taken.',
    manufacturerData: 'Black Diamond recommends retiring carabiners after 10 years, or immediately if dropped from a significant height or showing deep grooves.',
    healthAnalysis: {
      needsReplacement: true,
      reason: 'Visible deep groove on the rope-bearing surface of one carabiner, which could damage the rope.',
      confidence: 0.95,
      analyzedAt: new Date(),
    },
  },
];

export function Dashboard() {
  const [equipment, setEquipment] = React.useState<Equipment[]>(initialEquipment);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const addEquipment = (item: Equipment) => {
    setEquipment(prev => [item, ...prev]);
    setIsSheetOpen(false);
  };
  
  const updateEquipment = (updatedItem: Equipment) => {
    setEquipment(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };
  
  const alerts = equipment.filter(item => item.healthAnalysis?.needsReplacement);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="size-6" />
              <span className="font-headline text-lg">GearGuardian</span>
            </a>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <ShieldCheck className="h-4 w-4" />
                My Equipment
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </a>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle className="font-headline">Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock unlimited gear checks and advanced features.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
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
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <a
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Logo className="h-6 w-6" />
                  <span className="font-headline">GearGuardian</span>
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShieldCheck className="h-5 w-5" />
                  My Equipment
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </a>
              </nav>
               <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our support
                      team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
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
                  placeholder="Search equipment..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
           <AddEquipmentSheet onSave={addEquipment} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Add Equipment
              </Button>
            </AddEquipmentSheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">My Equipment</h1>
             <TooltipProvider>
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                                <LayoutGrid className="size-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Grid View</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                                <List className="size-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>List View</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
          </div>
          
           {alerts.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-md font-semibold md:text-xl font-headline text-destructive">Urgent Alerts</h2>
              {alerts.map(item => (
                <Alert key={`alert-${item.id}`} variant="destructive">
                  <ShieldCheck className="h-4 w-4" />
                  <AlertTitle className="font-headline">{item.name} Needs Replacement!</AlertTitle>
                  <AlertDescription>
                    {item.healthAnalysis?.reason} (Confidence: {((item.healthAnalysis?.confidence ?? 0) * 100).toFixed(0)}%)
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'flex flex-col gap-4'
            }
          >
            {equipment.map(item => (
              <EquipmentCard key={item.id} equipment={item} onUpdate={updateEquipment} viewMode={viewMode}/>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
