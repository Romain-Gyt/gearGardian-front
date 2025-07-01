'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  PlusCircle,
  LogOut,
  PanelLeft,
  Search,
  LayoutGrid,
  List,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { EquipmentCard } from './equipment-card';
import { EquipmentSheet } from './add-equipment-sheet';
import { Tutorials } from './tutorials';
import { Logo } from './logo';
import { GearHealthDialog } from './gear-health-dialog';
import type { Equipment } from '@/lib/types';
import { ModeToggle } from '../mode-toggle';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import { ExpirationBanner } from './expiration-banner';
import { getEquipmentList, saveEquipment, deleteEquipment, logout, getProfile } from '@/lib/api/';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';


type View = 'equipment' | 'tutorials';

export function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoadingUser, setIsLoadingUser] = React.useState(true);

  const [equipment, setEquipment] = React.useState<Equipment[]>([]);
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [editingEquipment, setEditingEquipment] = React.useState<Equipment | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [activeView, setActiveView] = React.useState<View>('equipment');
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  // User preference for expiration alerts
  const [alertThreshold, setAlertThreshold] = React.useState(80);

  const [isHealthDialogOpen, setIsHealthDialogOpen] = React.useState(false);
  const [itemToAnalyze, setItemToAnalyze] = React.useState<Equipment | null>(null);

  React.useEffect(() => {
    // getProfile()
    //     .then((profile) => {
    //       if (profile.alertThreshold !== undefined) {
    //         setAlertThreshold(profile.alertThreshold);
    //       }
    //     })
    //     .catch((err) => {
    //       console.error('Failed to fetch profile', err);
    //       router.push('/login');
    //     })
    //     .finally(() => setIsLoadingUser(false));
    setIsLoadingUser(false);
  }, [router]);

  const fetchEquipment = React.useCallback(async () => {
    setIsLoadingData(true);
    try {
      const list = await getEquipmentList();
      setEquipment(list);
    } catch (error) {
      console.error("Failed to fetch equipment:", error);
      toast({
        variant: 'destructive',
        title: 'Erreur de chargement',
        description: "Impossible de récupérer les équipements depuis la base de données.",
      });
    } finally {
      setIsLoadingData(false);
    }
  }, [toast]);


  React.useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const handleSaveEquipment = async (
    item: Omit<Equipment, 'id' | 'userId' | 'status' | 'percentageUsed'>,
    id?: string,
  ) => {
    setIsLoadingData(true);
    try {
      await saveEquipment(item, id);
      toast({
        title: 'Équipement sauvegardé',
        description: 'Vos modifications ont été enregistrées avec succès.',
      });
      fetchEquipment(); // Refetch data
      setIsSheetOpen(false);
      setEditingEquipment(null);
    } catch (error) {
      console.error("Failed to save equipment:", error);
      toast({
        variant: 'destructive',
        title: 'Erreur de sauvegarde',
        description: "L'enregistrement de l'équipement a échoué.",
      });
    } finally {
      setIsLoadingData(false);
    }
  };
  
  const handleAddItem = () => {
    setEditingEquipment(null);
    setIsSheetOpen(true);
  }

  const handleEditItem = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setIsSheetOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (itemToDelete) {
      setIsLoadingData(true);
      try {
        await deleteEquipment(itemToDelete);
        toast({
          title: 'Équipement supprimé',
          description: "L'équipement a été supprimé de vos archives.",
        });
        fetchEquipment(); // Refetch data
      } catch (error) {
        console.error("Failed to delete equipment:", error);
        toast({
          variant: 'destructive',
          title: 'Erreur de suppression',
          description: "La suppression de l'équipement a échoué.",
        });
      } finally {
        setIsLoadingData(false);
        setShowDeleteConfirm(false);
        setItemToDelete(null);
      }
    }
  };

  const handleAnalyzeRequest = (item: Equipment) => {
    setItemToAnalyze(item);
    setIsHealthDialogOpen(true);
  };
  
  const handleLogout = async () => {
    try {
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de déconnexion',
        description: 'Impossible de vous déconnecter. Veuillez réessayer.',
      });
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    return (
      item.name.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      (item.serialNumber && item.serialNumber.toLowerCase().includes(query)) ||
      item.description.toLowerCase().includes(query) ||
      item.manufacturerData.toLowerCase().includes(query)
    );
  });

  const NavLink = ({ view, label, icon: Icon }: { view: View, label: string, icon: React.ElementType }) => (
      <a
        href="#"
        onClick={(e) => {
            e.preventDefault();
            setActiveView(view);
        }}
        className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            activeView === view && "bg-muted text-primary"
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </a>
  );

  const MobileNavLink = ({ view, label, icon: Icon }: { view: View, label: string, icon: React.ElementType }) => (
      <a
        href="#"
        onClick={(e) => {
            e.preventDefault();
            setActiveView(view);
        }}
        className={cn(
            "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
            activeView === view && "bg-muted text-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        {label}
      </a>
  );
  
  if (isLoadingUser) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Logo size={56} className="rounded" />
              <span className="font-headline text-lg">GearGuardian</span>
            </a>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLink view="equipment" label="Mon Équipement" icon={ShieldCheck} />
              <NavLink view="tutorials" label="Tutoriels" icon={BookOpen} />
            </nav>
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
                  href="/dashboard"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Logo className="h-6 w-6" />
                  <span className="font-headline">GearGuardian</span>
                </a>
                <MobileNavLink view="equipment" label="Mon Équipement" icon={ShieldCheck} />
                <MobileNavLink view="tutorials" label="Tutoriels" icon={BookOpen} />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {activeView === 'equipment' && (
                <form>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Rechercher un équipement..."
                        className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>
            )}
          </div>
           <Button size="sm" className="gap-1" onClick={handleAddItem}>
            <PlusCircle className="h-4 w-4" />
            Ajouter un équipement
          </Button>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="sr-only">Basculer le menu utilisateur</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>Profil</DropdownMenuItem>
              <DropdownMenuItem disabled>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <ExpirationBanner equipment={equipment} threshold={alertThreshold} />
          {activeView === 'equipment' ? (
            <>
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

              {isLoadingData ? (
                 <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'flex flex-col gap-4'
                  }
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    viewMode === 'grid' ? (
                      <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="h-40 w-full rounded-lg" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ) : (
                      <Skeleton key={i} className="h-24 w-full rounded-lg" />
                    )
                  ))}
                </div>
              ) : filteredEquipment.length > 0 ? (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'flex flex-col gap-4'
                  }
                >
                  {filteredEquipment.map(item => (
                    <EquipmentCard 
                      key={item.id} 
                      equipment={item} 
                      viewMode={viewMode}
                      onEdit={handleEditItem}
                      onDelete={handleDeleteRequest}
                      onAnalyze={handleAnalyzeRequest}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <h3 className="text-2xl font-bold tracking-tight">Vous n'avez aucun équipement</h3>
                        <p className="text-sm text-muted-foreground">Commencez par en ajouter un pour le suivre.</p>
                        <Button className="mt-4" onClick={handleAddItem}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Ajouter un équipement
                        </Button>
                    </div>
                </div>
              )}
            </>
          ) : (
            <Tutorials />
          )}
        </main>
      </div>
      <EquipmentSheet 
        onSave={handleSaveEquipment} 
        isOpen={isSheetOpen} 
        onOpenChange={setIsSheetOpen}
        initialData={editingEquipment}
        isLoading={isLoadingData}
      />
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement cet équipement de vos archives.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className={buttonVariants({ variant: 'destructive' })}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <GearHealthDialog
        isOpen={isHealthDialogOpen}
        onOpenChange={(open) => {
            if (!open) {
                setItemToAnalyze(null);
            }
            setIsHealthDialogOpen(open);
        }}
        equipment={itemToAnalyze}
      />
    </div>
  );
}
