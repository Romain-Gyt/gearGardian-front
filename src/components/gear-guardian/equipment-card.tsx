// src/components/gear-guardian/equipment-card.tsx
'use client';

import * as React from 'react';
import type { BadgeProps } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { EPI, EquipmentStatus } from '@/lib/types';
import { deriveStatus } from '@/lib/utils';
import {
    CalendarDays,
    ShieldCheck,
    ShieldAlert,
    ShieldQuestion,
    MoreHorizontal,
    Pencil,
    Trash2,
    Archive,
    BrainCircuit,
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface EquipmentCardProps {
    equipment: EPI;
    viewMode: 'grid' | 'list';
    onEdit: (equipment: EPI) => void;
    onDelete: (id: string) => void;
    onAnalyze: (equipment: EPI) => void;
}

export function EquipmentCard({ equipment, viewMode, onEdit, onDelete, onAnalyze }: EquipmentCardProps) {
    // Déstructuration des données
    const {
        id,
        name,
        type,
        serialNumber,
        description,
        manufacturerData,
        photoAiHint,
        archived,
        purchaseDate,
        expectedEndOfLife,
        percentageUsed,
    } = equipment;
    const rawPhotoUrl = equipment.photos?.[0]?.url;
    const photoUrl = rawPhotoUrl
        ? `http://localhost:8080/${rawPhotoUrl.replace(/\\/g, '/')}` // ✅ force les slashes
        : null;

    console.log('Rendering EquipmentCard for:', name, 'with photo URL:', photoUrl);
    // On en déduit l'enum EquipmentStatus
    const equipmentStatus = deriveStatus(equipment);

    // Mapping typé grâce à BadgeProps['variant']
    const statusMapping: Record<EquipmentStatus, {
        text: string;
        Icon: React.ComponentType<any>;
        progressClass: string;
        badgeClass: string;
    }> = {
        [EquipmentStatus.ARCHIVED]: {
            text: 'Archivé',
            Icon: Archive,
            progressClass: 'bg-gray-400',
            badgeClass:   'bg-gray-400 text-white',
        },
        [EquipmentStatus.EXPIRED]: {
            text: 'Expiré',
            Icon: ShieldAlert,
            progressClass: 'bg-destructive',
            badgeClass:   'bg-destructive text-white',
        },
        [EquipmentStatus.EXPIRING_SOON]: {
            text: 'Expire bientôt',
            Icon: ShieldQuestion,
            progressClass: 'bg-yellow-500',
            badgeClass:   'bg-yellow-500 text-black',
        },
        [EquipmentStatus.GOOD]: {
            text: 'Bon état',
            Icon: ShieldCheck,
            progressClass: 'bg-primary',
            badgeClass:   'bg-primary text-white',
        },
    };

    const statusConfig = statusMapping[equipmentStatus];
    const expirationDateString = new Date(expectedEndOfLife).toLocaleDateString('fr-FR');
    const purchaseDateString   = new Date(purchaseDate).toLocaleDateString('fr-FR');

    // Actions du menu
    const CardActions = () => (
        <div className="absolute top-2 right-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full bg-black/30 hover:bg-black/50 border-none text-white">
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
                    <DropdownMenuItem
                        onClick={() => onDelete(id)}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                        <Trash2 className="mr-2 size-4" />
                        Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );

    // Vue liste
    if (viewMode === 'list') {
        return (
            <Card className="flex items-center p-4 gap-4 relative">
                {photoUrl ? (
                    <Image
                        src={photoUrl}
                        alt={name}
                        width={400}
                        height={200}
                        unoptimized
                        className="rounded-t-lg object-cover w-full aspect-[2/1]"
                    />
                ) : (
                    <div className="rounded-t-lg bg-muted w-full aspect-[2/1] flex items-center justify-center text-muted-foreground text-sm">
                        Aucune photo
                    </div>
                )}

                <div className="flex-1 grid grid-cols-6 items-center gap-4">
                    <div className="col-span-3 self-start">
                        <h3 className="font-semibold font-headline">{name}</h3>
                        <p className="text-xs text-muted-foreground">
                            {type}{serialNumber && ` – ${serialNumber}`}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 truncate" title={description}>
                            {description}
                        </p>
                        {manufacturerData && (
                            <p className="text-xs text-muted-foreground mt-1 truncate" title={manufacturerData}>
                                <strong>Note fabricant :</strong> {manufacturerData}
                            </p>
                        )}
                    </div>
                    <div className="self-center">
                        <Badge className={`gap-1.5 ${statusConfig.badgeClass}`}>
                            <statusConfig.Icon className="size-3" />
                            {statusConfig.text}
                        </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground self-center">
                        <p>Expire le :</p>
                        <p>{expirationDateString}</p>
                    </div>
                    <div className="flex justify-end self-center">
                        <CardActions />
                    </div>
                </div>
            </Card>
        );
    }

    // Vue grille
    return (
        <Card className="flex flex-col">
            <CardHeader className="p-0">
                <div className="relative">
                    {photoUrl ? (
                        <Image
                            src={photoUrl}
                            alt={name}
                            width={400}
                            height={200}
                            unoptimized
                            className="rounded-t-lg object-cover w-full aspect-[2/1]"
                        />
                    ) : (
                        <div className="rounded-t-lg bg-muted w-full aspect-[2/1] flex items-center justify-center text-muted-foreground text-sm">
                            Aucune photo
                        </div>
                    )}

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge className={`absolute top-2 left-2 gap-1.5 ${statusConfig.badgeClass}`}>
                                    <statusConfig.Icon className="size-3" />
                                    {statusConfig.text}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>{`Statut : ${statusConfig.text}`}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <CardActions />
                </div>
                <div className="p-6 pb-2">
                    <CardTitle className="font-headline text-xl leading-tight">{name}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 pt-2 text-xs">
                        {type}{serialNumber && ` / ${serialNumber}`}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="flex-grow p-6 pt-0">
                <p className="text-sm text-muted-foreground pt-4">{description}</p>
                {manufacturerData && (
                    <p className="text-xs text-muted-foreground mt-2 border-l-2 pl-2 italic">
                        <strong>Note fabricant :</strong> {manufacturerData}
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
                        <Progress
                            value={percentageUsed}
                            indicatorClassName={statusConfig.progressClass}
                            className="mt-1 h-2"
                        />
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
