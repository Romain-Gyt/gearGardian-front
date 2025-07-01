'use client';

import * as React from 'react';
import Image from 'next/image';
import { Equipment, EquipmentStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ShieldCheck, ShieldAlert, ShieldQuestion, MoreHorizontal, Pencil, Trash2, Archive, BrainCircuit } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface EquipmentCardProps {
  equipment: Equipment;
  viewMode: 'grid' | 'list';
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => void;
  onAnalyze: (equipment: Equipment) => void;
}

export function EquipmentCard({ equipment, viewMode, onEdit, onDelete, onAnalyze }: EquipmentCardProps) {
  const { expectedEndOfLife, archived, purchaseDate, percentageUsed, status: equipmentStatus } = equipment;

  const getStatus = () => {
    switch (equipmentStatus) {
      case EquipmentStatus.ARCHIVED:
        return {
          text: 'Archivé',
          variant: 'outline',
          Icon: Archive,
          progressClass: 'bg-gray-400',
        } as const;
      case EquipmentStatus.EXPIRED:
        return {
          text: 'Expiré',
          variant: 'destructive',
          Icon: ShieldAlert,
          progressClass: 'bg-destructive',
        } as const;
      case EquipmentStatus.EXPIRING_SOON:
        return {
          text: 'Expire bientôt',
          variant: 'secondary',
          Icon: ShieldQuestion,
          progressClass: 'bg-yellow-500',
        } as const;
      default:
        return {
          text: 'Bon état',
          variant: 'default',
          Icon: ShieldCheck,
          progressClass: 'bg-primary',
        } as const;
    }
  };

  const status = getStatus();
  const expirationDateString = new Date(expectedEndOfLife).toLocaleDateString('fr-FR');
  const purchaseDateString = new Date(purchaseDate).toLocaleDateString('fr-FR');

  const CardActions = () => (
    <div className="absolute top-2 right-2">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="size-7 rounded-full bg-black/30 hover:bg-black/50 border-none text-white">
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onAnalyze(equipment)}>
                    <BrainCircuit className="mr-2 size-4" />
                    Analyse IA
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(equipment)}>
                    <Pencil className="mr-2 size-4" />
                    Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(equipment.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash2 className="mr-2 size-4" />
                    Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );

  if (viewMode === 'list') {
    return (
      <Card className="flex items-center p-4 gap-4 relative">
        <Image
          src={equipment.photoUrl}
          alt={equipment.name}
          width={80}
          height={80}
          className="rounded-md object-cover aspect-square"
          data-ai-hint={equipment.photoAiHint}
        />
        <div className="flex-1 grid grid-cols-6 items-center gap-4">
            <div className="col-span-3 self-start">
                <h3 className="font-semibold font-headline">{equipment.name}</h3>
                <p className="text-xs text-muted-foreground">{equipment.type} {equipment.serialNumber && `- ${equipment.serialNumber}`}</p>
                 <p className="text-sm text-muted-foreground mt-1 truncate" title={equipment.description}>
                    {equipment.description}
                </p>
                {equipment.manufacturerData && (
                    <p className="text-xs text-muted-foreground mt-1 truncate" title={equipment.manufacturerData}>
                        <strong>Note fabricant:</strong> {equipment.manufacturerData}
                    </p>
                )}
            </div>
            <div className="self-center">
                <Badge variant={status.variant} className="gap-1.5">
                    <status.Icon className="size-3" />
                    {status.text}
                </Badge>
            </div>
            <div className="text-sm text-muted-foreground self-center">
                <p>Expire le :</p>
                <p>{expirationDateString}</p>
            </div>
            <div className="flex justify-end self-center">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onAnalyze(equipment)}>
                            <BrainCircuit className="mr-2 size-4" />
                            Analyse IA
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(equipment)}>
                            <Pencil className="mr-2 size-4" />
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(equipment.id)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 size-4" />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <div className="relative">
            <Image
            src={equipment.photoUrl}
            alt={equipment.name}
            width={400}
            height={200}
            className="rounded-t-lg object-cover w-full aspect-[2/1]"
            data-ai-hint={equipment.photoAiHint}
            />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge variant={status.variant} className="absolute top-2 left-2 gap-1.5">
                            <status.Icon className="size-3" />
                            {status.text}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                       {`Statut: ${status.text}`}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CardActions />
        </div>
        <div className="p-6 pb-2">
            <CardTitle className="font-headline text-xl leading-tight">{equipment.name}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 pt-2 text-xs">
                {equipment.type} {equipment.serialNumber && ` / ${equipment.serialNumber}`}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <p className="text-sm text-muted-foreground pt-4">{equipment.description}</p>
        {equipment.manufacturerData && (
            <p className="text-xs text-muted-foreground mt-2 border-l-2 pl-2 italic">
                <strong>Note fabricant:</strong> {equipment.manufacturerData}
            </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p-6 pt-0 mt-auto w-full">
        <CardDescription className="flex items-center gap-1.5 text-xs">
            <CalendarDays className="size-3.5" />
            Acheté le : {purchaseDateString}
        </CardDescription>
        {!archived && (
            <div className="w-full">
            <span className="text-xs font-medium text-muted-foreground">
                Durée de vie (Expire le {expirationDateString})
            </span>
            <Progress value={percentageUsed} className="mt-1 h-2" indicatorClassName={status.progressClass} />
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
