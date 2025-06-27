'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { GearHealthOutput } from '@/ai/flows/gear-health-analyzer';

interface GearHealthDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  analysis: GearHealthOutput | null;
  isLoading: boolean;
}

export function GearHealthDialog({ isOpen, onOpenChange, analysis, isLoading }: GearHealthDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Analyse de l'équipement par IA</DialogTitle>
          <DialogDescription>
            Résultats de l'analyse d'usure et de sécurité de votre équipement.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Analyse en cours, veuillez patienter...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Verdict de sécurité</h3>
                <div className="flex items-center gap-4">
                    <Badge variant={analysis.isSafe ? 'default' : 'destructive'} className="gap-2 text-base py-1 px-3">
                        {analysis.isSafe ? <ShieldCheck className="size-5" /> : <ShieldAlert className="size-5" />}
                        {analysis.isSafe ? 'Utilisation sûre' : 'DANGER - Ne pas utiliser'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                        Confiance: {Math.round(analysis.confidence * 100)}%
                    </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Raisonnement</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysis.reasoning}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Recommandations</h3>
                <p className="text-sm text-muted-foreground font-medium">{analysis.recommendations}</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Aucune analyse à afficher.</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
