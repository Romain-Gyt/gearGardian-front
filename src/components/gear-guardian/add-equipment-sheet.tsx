'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn, } from '@/lib/utils';
import { format } from 'date-fns';
import type { Equipment } from '@/lib/types';
import { fr } from 'date-fns/locale';

const equipmentSchema = z.object({
  name: z.string().min(3, 'Le nom doit comporter au moins 3 caractères'),
  purchaseDate: z.date({ required_error: 'La date d\'achat est requise' }),
  lifespanYears: z.coerce.number().min(1, 'La durée de vie doit être d\'au moins 1 an').max(50, 'La durée de vie ne peut pas dépasser 50 ans'),
  description: z.string().min(10, 'La description doit comporter au moins 10 caractères'),
  manufacturerData: z.string().optional(),
  photo: z.any().refine(files => files?.length === 1, 'La photo est requise.'),
});

type EquipmentFormValues = z.infer<typeof equipmentSchema>;

interface AddEquipmentSheetProps {
  children: React.ReactNode;
  onSave: (equipment: Omit<Equipment, 'id'>) => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddEquipmentSheet({ children, onSave, isOpen, onOpenChange }: AddEquipmentSheetProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      lifespanYears: 10,
    },
  });

  const onSubmit = (data: EquipmentFormValues) => {
    setIsSaving(true);
    const photoFile = data.photo[0];
    const newEquipment: Omit<Equipment, 'id'> = {
        name: data.name,
        purchaseDate: data.purchaseDate,
        lifespanYears: data.lifespanYears,
        description: data.description,
        manufacturerData: data.manufacturerData || '',
        photoUrl: URL.createObjectURL(photoFile),
        photoAiHint: 'climbing gear',
    };
    onSave(newEquipment);
    form.reset();
    setIsSaving(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SheetHeader>
            <SheetTitle className="font-headline">Ajouter un équipement</SheetTitle>
            <SheetDescription>
              Remplissez les détails de votre nouvel équipement. Cliquez sur enregistrer lorsque vous avez terminé.
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
              <Label htmlFor="photo">Photo</Label>
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
                            onSelect={(date) => form.setValue('purchaseDate', date as Date)}
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
              Enregistrer l'équipement
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
