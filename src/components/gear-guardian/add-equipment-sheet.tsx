'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Equipment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

interface EquipmentSheetProps {
  onSave: (equipment: Omit<Equipment, 'id'>, id?: string) => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialData?: Equipment | null;
}

export function EquipmentSheet({ onSave, isOpen, onOpenChange, initialData }: EquipmentSheetProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const isEditMode = !!initialData;

  const equipmentSchema = React.useMemo(() => z.object({
    name: z.string().min(3, { message: 'Le nom doit comporter au moins 3 caractères.' }),
    purchaseDate: z.date({ required_error: "La date d'achat est requise." }),
    lifespanYears: z.coerce.number().min(1, "La durée de vie doit être d'au moins 1 an.").max(50, 'La durée de vie ne peut pas dépasser 50 ans.'),
    description: z.string().min(10, { message: 'La description doit comporter au moins 10 caractères.' }),
    manufacturerData: z.string().optional(),
    photo: z.any().refine(
      (files) => {
        if (isEditMode) return true; // Photo is optional in edit mode
        return files?.length === 1; // Photo is required in create mode
      },
      { message: 'La photo est requise.' }
    ),
  }), [isEditMode]);

  type EquipmentFormValues = z.infer<typeof equipmentSchema>;

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: '',
      purchaseDate: undefined,
      lifespanYears: 10,
      description: '',
      manufacturerData: '',
      photo: undefined,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          ...initialData,
          purchaseDate: new Date(initialData.purchaseDate),
          photo: undefined, // Reset photo input
        });
      } else {
        form.reset(); // Reset to defaultValues for new item
      }
    }
  }, [isOpen, initialData, form]);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Échec de la lecture du fichier."));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: EquipmentFormValues) => {
    setIsSaving(true);
    let photoUrl = initialData?.photoUrl || '';
    const photoAiHint = initialData?.photoAiHint || 'climbing gear';

    if (data.photo && data.photo.length > 0) {
      const photoFile = data.photo[0];
      try {
        photoUrl = await fileToDataUri(photoFile);
      } catch (error) {
        console.error("Erreur lors de la conversion du fichier:", error);
        setIsSaving(false);
        return;
      }
    }
    
    const newEquipment: Omit<Equipment, 'id'> = {
      name: data.name,
      purchaseDate: data.purchaseDate,
      lifespanYears: data.lifespanYears,
      description: data.description,
      manufacturerData: data.manufacturerData || '',
      photoUrl: photoUrl,
      photoAiHint: photoAiHint,
    };
    onSave(newEquipment, initialData?.id);
    setIsSaving(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SheetHeader>
            <SheetTitle className="font-headline">{isEditMode ? "Modifier l'équipement" : "Ajouter un équipement"}</SheetTitle>
            <SheetDescription>
              {isEditMode ? "Modifiez les détails de votre équipement." : "Remplissez les détails de votre nouvel équipement."} Cliquez sur enregistrer lorsque vous avez terminé.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de l'équipement</Label>
              <Input id="name" {...form.register('name')} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="photo">Photo {isEditMode && '(Optionnel: laisser vide pour garder l'ancienne)'}</Label>
              <Input id="photo" type="file" accept="image/*" {...form.register('photo')} />
              {form.formState.errors.photo && (
                <p className="text-sm text-destructive">{form.formState.errors.photo.message as string}</p>
              )}
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Date d'achat</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={cn(
                            'justify-start text-left font-normal',
                            !form.watch('purchaseDate') && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.watch('purchaseDate') ? format(form.watch('purchaseDate'), 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            locale={fr}
                            mode="single"
                            selected={form.watch('purchaseDate')}
                            onSelect={(date) => form.setValue('purchaseDate', date as Date, { shouldValidate: true })}
                            initialFocus
                            disabled={(date) => date > new Date() || date < new Date('1990-01-01')}
                        />
                        </PopoverContent>
                    </Popover>
                    {form.formState.errors.purchaseDate && (
                        <p className="text-sm text-destructive">{form.formState.errors.purchaseDate.message}</p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="lifespanYears">Durée de vie (ans)</Label>
                    <Input id="lifespanYears" type="number" {...form.register('lifespanYears')} />
                    {form.formState.errors.lifespanYears && (
                        <p className="text-sm text-destructive">{form.formState.errors.lifespanYears.message}</p>
                    )}
                </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description et historique d'utilisation</Label>
              <Textarea id="description" {...form.register('description')} />
               {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manufacturerData">Données fabricant (Optionnel)</Label>
              <Textarea
                id="manufacturerData"
                placeholder="ex: marque, modèle, recommendations de mise au rebut..."
                {...form.register('manufacturerData')}
              />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
