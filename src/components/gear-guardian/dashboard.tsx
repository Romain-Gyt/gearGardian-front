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
} from '@/components/ui/alert-dialog';
import { EquipmentCard } from './equipment-card';
import { EquipmentSheet } from './add-equipment-sheet';
import { Tutorials } from './tutorials';
import { Logo } from './logo';
import { GearHealthDialog } from './gear-health-dialog';
import type { EPI, EPIRequestPayload } from '@/lib/types';
import { ModeToggle } from '../mode-toggle';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import { ExpirationBanner } from './expiration-banner';
import {
  getEquipmentList,
  saveEquipment,
  deleteEquipment,
  logout,
  getProfile,
} from '@/lib/api/';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

type View = 'equipment' | 'tutorials';

export function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoadingUser, setIsLoadingUser] = React.useState(true);
  const [equipment, setEquipment] = React.useState<EPI[]>([]);
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [editingEquipment, setEditingEquipment] = React.useState<EPI | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [activeView, setActiveView] = React.useState<View>('equipment');
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const [alertThreshold, setAlertThreshold] = React.useState(80);
  const [isHealthDialogOpen, setIsHealthDialogOpen] = React.useState(false);
  const [itemToAnalyze, setItemToAnalyze] = React.useState<EPI | null>(null);

  React.useEffect(() => {
    // Si vous voulez récupérer le profil :
    // getProfile()...
    setIsLoadingUser(false);
  }, [router]);

  const fetchEquipment = React.useCallback(async () => {
    setIsLoadingData(true);
    try {
      const list = await getEquipmentList();
      console.log('Fetched equipment list:', list);
      setEquipment(list);
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
      toast({
        variant: 'destructive',
        title: 'Erreur de chargement',
        description: "Impossible de récupérer les équipements.",
      });
    } finally {
      setIsLoadingData(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const handleSaveEquipment = async (item: EPIRequestPayload, id?: string): Promise<EPI> => {
    setIsLoadingData(true);
    try {
      const data = await saveEquipment(item, id);
      toast({
        title: 'Équipement sauvegardé',
        description: 'Modifications enregistrées.',
      });
      fetchEquipment();
      setIsSheetOpen(false);
      setEditingEquipment(null);
      return data;
    } catch (err) {
      console.error('Failed to save equipment:', err);
      toast({
        variant: 'destructive',
        title: 'Erreur de sauvegarde',
        description: "L'enregistrement a échoué.",
      });
      throw err; // ✅ force le typage Promise<EPI>
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleAddItem = () => {
    setEditingEquipment(null);
    setIsSheetOpen(true);
  };

  const handleEditItem = (eq: EPI) => {
    setEditingEquipment(eq);
    setIsSheetOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsLoadingData(true);
    try {
      await deleteEquipment(itemToDelete);
      toast({
        title: 'Équipement supprimé',
        description: 'Suppression réussie.',
      });
      fetchEquipment();
    } catch (err) {
      console.error('Failed to delete equipment:', err);
      toast({
        variant: 'destructive',
        title: 'Erreur de suppression',
        description: "La suppression a échoué.",
      });
    } finally {
      setIsLoadingData(false);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const handleAnalyzeRequest = (eq: EPI) => {
    setItemToAnalyze(eq);
    setIsHealthDialogOpen(true);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const filteredEquipment = equipment.filter((item) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
        item.name.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        (item.serialNumber?.toLowerCase().includes(q) ?? false) ||
        item.description.toLowerCase().includes(q) ||
        (item.manufacturerData?.toLowerCase().includes(q) ?? false)
    );
  });

  if (isLoadingUser) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <a href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Logo size={56} className="rounded" />
                <span className="font-headline text-lg">GearGuardian</span>
              </a>
            </div>
            <nav className="flex-1 px-4 text-sm font-medium lg:px-6">
              <button onClick={() => setActiveView('equipment')} className={cn('flex items-center gap-2 px-3 py-2 rounded-lg', activeView==='equipment'?'bg-muted text-primary':'text-muted-foreground')}>
                <ShieldCheck className="h-4 w-4" /> Mon Équipement
              </button>
              <button onClick={() => setActiveView('tutorials')} className={cn('flex items-center gap-2 px-3 py-2 rounded-lg mt-2', activeView==='tutorials'?'bg-muted text-primary':'text-muted-foreground')}>
                <BookOpen className="h-4 w-4" /> Tutoriels
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-col">
          <header
              className="flex h-14 items-center justify-between gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="flex items-center gap-2 w-full">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <PanelLeft className="h-5 w-5"/>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <Logo size={32} className="mb-4"/>
                  <button onClick={() => setActiveView('equipment')} className="flex items-center gap-2 mb-2">
                    <ShieldCheck/> Mon Équipement
                  </button>
                  <button onClick={() => setActiveView('tutorials')} className="flex items-center gap-2">
                    <BookOpen/> Tutoriels
                  </button>
                </SheetContent>
              </Sheet>

              {activeView === 'equipment' && (
                  <div className="relative flex items-center flex-1 min-w-0">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none"/>
                    <Input
                        type="search"
                        placeholder="Rechercher un équipement..."
                        className="w-50 pl-10 pr-4 h-10 rounded-md border border-input bg-background text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeView === 'equipment' && (
                  <Button size="sm" onClick={handleAddItem}>
                    <PlusCircle className="mr-1"/> Ajouter
                  </Button>
              )}
              <ModeToggle/>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <LogOut className="h-5 w-5"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2"/> Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <ExpirationBanner equipment={equipment} threshold={alertThreshold}/>

            {activeView === 'equipment' ? (
                <>
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-headline">Mon Équipement</h1>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon"
                                    onClick={() => setViewMode('grid')}>
                              <LayoutGrid/>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Grille</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon"
                                    onClick={() => setViewMode('list')}>
                              <List/>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Liste</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {isLoadingData ? (
                      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-4'}>
                        {Array.from({ length: 4 }).map((_, i) =>
                            viewMode === 'grid' ? (
                                <div key={i}>
                                  <Skeleton className="h-40 rounded-lg" />
                                  <Skeleton className="h-5 w-3/4 mt-2" />
                                </div>
                            ) : (
                                <Skeleton key={i} className="h-24 w-full rounded-lg" />
                            )
                        )}
                      </div>
                  ) : filteredEquipment.length > 0 ? (
                      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-4'}>
                        {filteredEquipment.map((eq) => (
                            <EquipmentCard
                                key={eq.id}
                                equipment={eq}
                                viewMode={viewMode}
                                onEdit={() => handleEditItem(eq)}
                                onDelete={() => handleDeleteRequest(eq.id)}
                                onAnalyze={() => handleAnalyzeRequest(eq)}
                            />
                        ))}
                      </div>
                  ) : (
                      <div className="flex flex-1 items-center justify-center">
                        <div className="text-center">
                          <p className="mb-2">Aucun équipement</p>
                          <Button onClick={handleAddItem}>Ajouter un équipement</Button>
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
            onRefresh={fetchEquipment}
        />

        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className={buttonVariants({ variant: 'destructive' })}>
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <GearHealthDialog
            isOpen={isHealthDialogOpen}
            onOpenChange={(open) => {
              if (!open) setItemToAnalyze(null);
              setIsHealthDialogOpen(open);
            }}
            equipment={itemToAnalyze}
        />
      </div>
  );
}
