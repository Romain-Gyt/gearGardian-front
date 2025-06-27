'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Equipment } from '@/lib/types';
import { Bot, CalendarDays, Shield, ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import { GearHealthDialog } from './gear-health-dialog';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

interface EquipmentCardProps {
  equipment: Equipment;
  onUpdate: (equipment: Equipment) => void;
  viewMode: 'grid' | 'list';
}

export function EquipmentCard({ equipment, onUpdate, viewMode }: EquipmentCardProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { purchaseDate, lifespanYears, healthAnalysis } = equipment;
  const purchaseTime = purchaseDate.getTime();
  const lifespanMillis = lifespanYears * 365.25 * 24 * 60 * 60 * 1000;
  const expirationDate = new Date(purchaseTime + lifespanMillis);
  const timeElapsed = Date.now() - purchaseTime;
  const percentageUsed = Math.min(100, (timeElapsed / lifespanMillis) * 100);

  const getStatus = () => {
    if (healthAnalysis?.needsReplacement) {
      return {
        text: 'Replacement Needed',
        variant: 'destructive',
        Icon: ShieldAlert,
        progressClass: 'bg-destructive',
      } as const;
    }
    if (percentageUsed >= 100) {
      return {
        text: 'Expired',
        variant: 'destructive',
        Icon: ShieldAlert,
        progressClass: 'bg-destructive',
      } as const;
    }
    if (percentageUsed >= 80) {
      return {
        text: 'Expires Soon',
        variant: 'secondary',
        Icon: ShieldQuestion,
        progressClass: 'bg-yellow-500',
      } as const;
    }
    return {
      text: 'Good',
      variant: 'default',
      Icon: ShieldCheck,
      progressClass: 'bg-primary',
    } as const;
  };

  const status = getStatus();

  if (viewMode === 'list') {
    return (
      <Card className="flex items-center p-4 gap-4">
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
                <p className="text-sm text-muted-foreground">{equipment.description}</p>
            </div>
            <div>
                <Badge variant={status.variant} className="gap-1.5">
                    <status.Icon className="size-3" />
                    {status.text}
                </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
                <p>Expires:</p>
                <p>{expirationDate.toLocaleDateString()}</p>
            </div>
            <div className="flex justify-end gap-2">
                <GearHealthDialog equipment={equipment} onUpdate={onUpdate} isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <Button variant="outline" size="sm">
                    <Bot className="mr-2 h-4 w-4" /> Analyze
                  </Button>
                </GearHealthDialog>
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
                        <Badge variant={status.variant} className="absolute top-2 right-2 gap-1.5">
                            <status.Icon className="size-3" />
                            {status.text}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        {status.text === 'Replacement Needed' 
                            ? `AI analysis recommends replacement: ${healthAnalysis?.reason}`
                            : `Lifespan status: ${status.text}`}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <div className="p-6 pb-2">
            <CardTitle className="font-headline text-xl leading-tight">{equipment.name}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 pt-2">
                <CalendarDays className="size-3.5" />
                Purchased: {equipment.purchaseDate.toLocaleDateString()}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <div className="text-sm text-muted-foreground">{equipment.description}</div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 p-6 pt-0">
        <div>
          <span className="text-xs font-medium text-muted-foreground">
            Lifespan (Expires {expirationDate.toLocaleDateString()})
          </span>
          <Progress value={percentageUsed} className="mt-1 h-2" indicatorClassName={status.progressClass} />
        </div>
        <GearHealthDialog equipment={equipment} onUpdate={onUpdate} isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button className="w-full">
            <Bot className="mr-2 h-4 w-4" /> Analyze Health with AI
          </Button>
        </GearHealthDialog>
      </CardFooter>
    </Card>
  );
}

// Add this to ui/progress.tsx if you want custom indicator colors
// In Progress component:
// <ProgressPrimitive.Indicator
//   className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)}
// ...
// And in ProgressProps:
// indicatorClassName?: string
Progress.defaultProps = {
    ...Progress.defaultProps,
    indicatorClassName: '',
};

