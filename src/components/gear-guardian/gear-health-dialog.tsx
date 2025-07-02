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
import { Loader2, ShieldCheck, ShieldAlert, Upload } from 'lucide-react';
import type { GearHealthOutput } from '@/ai/flows/gear-health-analyzer';
import type {EPI, Equipment} from '@/lib/types';
import { analyzeGearHealth } from '@/ai/flows/gear-health-analyzer';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import Image from 'next/image';

interface GearHealthDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  equipment: EPI | null;
}

export function GearHealthDialog({ isOpen, onOpenChange, equipment }: GearHealthDialogProps) {
  const { toast } = useToast();
  const [analysis, setAnalysis] = React.useState<GearHealthOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      // Reset state when dialog opens
      setAnalysis(null);
      setIsLoading(false);
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  }, [isOpen]);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file.'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const handleAnalyze = async () => {
    if (!photoFile || !equipment) {
      toast({
        variant: 'destructive',
        title: 'Photo manquante',
        description: "Veuillez sélectionner une photo pour l'analyse.",
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const photoDataUri = await fileToDataUri(photoFile);
      // const result = await analyzeGearHealth({
      //   photoDataUri,
      //   description: equipment.description,
      //   manufacturerData: equipment.manufacturerData,
      // });
      // setAnalysis(result);
    } catch (error) {
      console.error("AI analysis error:", error);
      toast({
        variant: 'destructive',
        title: "Erreur d'analyse",
        description: "L'analyse par IA a échoué. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Analyse en cours, veuillez patienter...</p>
        </div>
      );
    }

    if (analysis) {
      return (
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
      );
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Téléversez une photo claire et récente de votre équipement pour obtenir une analyse d'usure par l'IA.
        </p>
        {photoPreview && (
          <div className="flex justify-center">
            <Image
              src={photoPreview}
              alt="Aperçu de la photo"
              width={200}
              height={200}
              className="rounded-md object-cover"
            />
          </div>
        )}
        <div className="grid gap-2">
            <label htmlFor="photo-upload" className="sr-only">Choisir une photo</label>
            <Input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <Button onClick={handleAnalyze} disabled={!photoFile || isLoading} className="w-full">
          <Upload className="mr-2" />
          Lancer l'analyse
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Analyse de l'équipement par IA</DialogTitle>
          <DialogDescription>
            {analysis 
             ? `Résultats pour : ${equipment?.name}` 
             : "Obtenez une analyse d'usure et de sécurité de votre équipement."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">{renderContent()}</div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
