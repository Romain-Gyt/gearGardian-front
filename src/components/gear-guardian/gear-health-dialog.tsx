'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import type { Equipment } from '@/lib/types';
import { analyzeGear } from '@/lib/actions';
import { Loader2, ShieldCheck, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import type { GearHealthAnalyzerOutput } from '@/ai/flows/gear-health-analyzer';
import { useToast } from '@/hooks/use-toast';

interface GearHealthDialogProps {
  equipment: Equipment;
  onUpdate: (equipment: Equipment) => void;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function GearHealthDialog({ equipment, onUpdate, children, isOpen, onOpenChange }: GearHealthDialogProps) {
  const [manufacturerData, setManufacturerData] = React.useState(equipment.manufacturerData);
  const [analysisResult, setAnalysisResult] = React.useState<GearHealthAnalyzerOutput | null>(equipment.healthAnalysis || null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!equipment.photoDataUri) {
      toast({
        variant: 'destructive',
        title: 'Missing Photo',
        description: 'Please re-upload the photo by editing the item to run an analysis.',
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    const result = await analyzeGear({
      photoDataUri: equipment.photoDataUri,
      description: equipment.description,
      manufacturerData: manufacturerData,
    });
    
    setIsLoading(false);

    if (result.success && result.data) {
      setAnalysisResult(result.data);
      const updatedEquipment = {
        ...equipment,
        manufacturerData,
        healthAnalysis: { ...result.data, analyzedAt: new Date() }
      };
      onUpdate(updatedEquipment);
    } else {
        toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: result.error || 'An unknown error occurred.',
        });
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
        // Reset state when closing, but keep existing analysis
        setManufacturerData(equipment.manufacturerData);
        setAnalysisResult(equipment.healthAnalysis || null);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">AI Gear Health Analysis</DialogTitle>
          <DialogDescription>
            Analyze "{equipment.name}" for potential safety issues. The AI will check the photo and description against manufacturer data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
                <Image
                    src={equipment.photoUrl}
                    alt={equipment.name}
                    width={300}
                    height={200}
                    className="rounded-lg object-cover w-full"
                    data-ai-hint={equipment.photoAiHint}
                />
                <div className="space-y-2">
                    <h4 className="font-semibold">Description & Usage</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
                        {equipment.description}
                    </p>
                </div>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="manufacturerData">Manufacturer Data</Label>
                    <Textarea
                        id="manufacturerData"
                        value={manufacturerData}
                        onChange={(e) => setManufacturerData(e.target.value)}
                        rows={5}
                        placeholder="Provide manufacturer guidelines, e.g., brand, model, retirement info."
                    />
                </div>
                <Button onClick={handleAnalyze} disabled={isLoading || !manufacturerData} className="w-full">
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                    </>
                ) : 'Run AI Analysis'}
                </Button>
                
                {analysisResult && (
                    <div className='pt-4'>
                    {analysisResult.needsReplacement ? (
                         <Alert variant="destructive">
                            <ShieldAlert className="h-4 w-4" />
                            <AlertTitle className="font-headline">Replacement Recommended</AlertTitle>
                            <AlertDescription>
                                {analysisResult.reason}
                                <Badge variant="outline" className="ml-2">Confidence: {Math.round(analysisResult.confidence * 100)}%</Badge>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert>
                            <ShieldCheck className="h-4 w-4" />
                            <AlertTitle className="font-headline">Gear Looks Good</AlertTitle>
                            <AlertDescription>
                                {analysisResult.reason}
                                <Badge variant="outline" className="ml-2">Confidence: {Math.round(analysisResult.confidence * 100)}%</Badge>
                            </AlertDescription>
                        </Alert>
                    )}
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
