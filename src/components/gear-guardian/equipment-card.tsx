'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Equipment } from '@/lib/types';
import { CalendarDays, ShieldCheck, ShieldAlert, ShieldQuestion, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface EquipmentCardProps {
  equipment: Equipment;
  viewMode: 'grid' | 'list';
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => void;
}

export function EquipmentCard({ equipment, viewMode, onEdit, onDelete }: EquipmentCardProps) {
  const { purchaseDate, lifespanYears } = equipment;
  const purchaseTime = new Date(purchaseDate).getTime();
  const lifespanMillis = lifespanYears * 365.25 * 24 * 60 * 60 * 1000;
  const expirationDate = new Date(purchaseTime + lifespanMillis);
  const timeElapsed = Date.now() - purchaseTime;
  const percentageUsed = Math.min(100, (timeElapsed / lifespanMillis) * 100);

  const getStatus = () => {
    if (percentageUsed >= 100) {
      return {
        text: 'Expiré',
        variant: 'destructive',
        Icon: ShieldAlert,
        progressClass: 'bg-destructive',
      } as const;
    }
    if (percentageUsed >= 80) {
      return {
        text: 'Expire bientôt',
        variant: 'secondary',
        Icon: ShieldQuestion,
        progressClass: 'bg-yellow-500',
      } as const;
    }
    return {
      text: 'Bon état',
      variant: 'default',
      Icon: ShieldCheck,
      progressClass: 'bg-primary',
    } as const;
  };

  const status = getStatus();
  const expirationDateString = expirationDate.toLocaleDateString('fr-FR');
  const purchaseDateString = new Date(equipment.purchaseDate).toLocaleDateString('fr-FR');

  const CardActions = () => (
    <div className="absolute top-2 right-2">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="size-7 rounded-full bg-black/30 hover:bg-black/50 border-none text-white">
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
        <div className="flex-1 grid grid-cols-5 items-center gap-4">
            <div className="col-span-2">
                <h3 className="font-semibold font-headline">{equipment.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{equipment.description}</p>
            </div>
            <div>
                <Badge variant={status.variant} className="gap-1.5">
                    <status.Icon className="size-3" />
                    {status.text}
                </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
                <p>Expire le :</p>
                <p>{expirationDateString}</p>
            </div>
            <div className="flex justify-end">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
                       {`Statut de durée de vie: ${status.text}`}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CardActions />
        </div>
        <div className="p-6 pb-2">
            <CardTitle className="font-headline text-xl leading-tight">{equipment.name}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 pt-2">
                <CalendarDays className="size-3.5" />
                Acheté le : {purchaseDateString}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <div className="text-sm text-muted-foreground">{equipment.description}</div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 p-6 pt-0 mt-auto">
        <div>
          <span className="text-xs font-medium text-muted-foreground">
            Durée de vie (Expire le {expirationDateString})
          </span>
          <Progress value={percentageUsed} className="mt-1 h-2" indicatorClassName={status.progressClass} />
        </div>
      </CardFooter>
    </Card>
  );
}
