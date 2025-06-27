'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Equipment } from '@/lib/types';
import { EquipmentType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface EquipmentSheetProps {
  onSave: (equipment: Omit<Equipment, 'id'>, id?: string) => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialData?: Equipment | null;
}

const equipmentFormSchema = z.object({
  name: z.string().min(3, { message: 'Le nom doit comporter au moins 3 caractères.' }),
  type: z.nativeEnum(EquipmentType, { required_error: "Le type d'équipement est requis." }),
  serialNumber: z.string().optional(),
  purchaseDate: z.date({ required_error: "La date d'achat est requise." }),
  serviceStartDate: z.date({ required_error: 'La date de mise en service est requise.' }),
  lifespanInYears: z.coerce.number({invalid_type_error: 'Veuillez entrer un nombre valide.'}).int().min(1, { message: "La durée de vie doit être d'au moins 1 an." }),
  expectedEndOfLife: z.date(),
  description: z.string().min(10, { message: 'La description doit comporter au moins 10 caractères.' }),
  manufacturerData: z.string().optional(),
  photo: z.any().optional(),
  archived: z.boolean().default(false),
});

type EquipmentFormValues = z.infer<typeof equipmentFormSchema>;

export function EquipmentSheet({ onSave, isOpen, onOpenChange, initialData }: EquipmentSheetProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const isEditMode = !!initialData;

  const validationSchema = React.useMemo(() => {
    if (isEditMode) {
      return equipmentFormSchema;
    }
    return equipmentFormSchema.extend({
      photo: z.any().refine((files) => files?.length === 1, {
        message: 'La photo est requise.',
      }),
    });
  }, [isEditMode]);

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(validationSchema),
  });

  const { watch, setValue } = form;
  const serviceStartDate = watch('serviceStartDate');
  const lifespanInYears = watch('lifespanInYears');
  const calculatedEol = watch('expectedEndOfLife');

  React.useEffect(() => {
    if (serviceStartDate && lifespanInYears && Number(lifespanInYears) > 0) {
      const eol = new Date(serviceStartDate);
      eol.setFullYear(eol.getFullYear() + Number(lifespanInYears));
      setValue('expectedEndOfLife', eol, { shouldValidate: true });
    }
  }, [serviceStartDate, lifespanInYears, setValue]);


  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const serviceDate = new Date(initialData.serviceStartDate);
        const endDate = new Date(initialData.expectedEndOfLife);
        const lifespan = Math.round((endDate.getTime() - serviceDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
        
        form.reset({
          name: initialData.name,
          type: initialData.type,
          serialNumber: initialData.serialNumber || '',
          purchaseDate: new Date(initialData.purchaseDate),
          serviceStartDate: serviceDate,
          lifespanInYears: lifespan > 0 ? lifespan : 10,
          expectedEndOfLife: endDate,
          description: initialData.description,
          manufacturerData: initialData.manufacturerData,
          photo: undefined,
          archived: initialData.archived,
        });
      } else {
        const defaultServiceDate = new Date();
        const defaultLifespan = 10;
        const defaultEndDate = new Date(defaultServiceDate);
        defaultEndDate.setFullYear(defaultEndDate.getFullYear() + defaultLifespan);
        
        form.reset({
          name: '',
          type: EquipmentType.OTHER,
          serialNumber: '',
          purchaseDate: new Date(),
          serviceStartDate: defaultServiceDate,
          lifespanInYears: defaultLifespan,
          expectedEndOfLife: defaultEndDate,
          description: '',
          manufacturerData: '',
          photo: undefined,
          archived: false,
        });
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
          reject(new Error('Échec de la lecture du fichier.'));
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
        console.error('Erreur lors de la conversion du fichier:', error);
        setIsSaving(false);
        return;
      }
    }

    const newEquipment: Omit<Equipment, 'id'> = {
      name: data.name,
      type: data.type,
      serialNumber: data.serialNumber,
      purchaseDate: data.purchaseDate,
      serviceStartDate: data.serviceStartDate,
      expectedEndOfLife: data.expectedEndOfLife,
      description: data.description,
      manufacturerData: data.manufacturerData || '',
      photoUrl: photoUrl,
      photoAiHint: photoAiHint,
      archived: data.archived,
    };
    onSave(newEquipment, initialData?.id);
    setIsSaving(false);
  };

  const DatePicker = ({ name, label }: { name: 'purchaseDate' | 'serviceStartDate'; label: string }) => (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={'outline'} className={cn('justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? format(field.value, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[60]">
              <Calendar
                locale={fr}
                mode="single"
                selected={field.value as Date}
                onSelect={(date) => field.onChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {form.formState.errors[name] && <p className="text-sm text-destructive">{form.formState.errors[name]?.message as string}</p>}
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SheetHeader>
            <SheetTitle className="font-headline">{isEditMode ? "Modifier l'équipement" : 'Ajouter un équipement'}</SheetTitle>
            <SheetDescription>
              {isEditMode ? "Modifiez les détails de votre équipement." : "Remplissez les détails de votre nouvel équipement."} Cliquez sur enregistrer lorsque vous avez terminé.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de l'équipement</Label>
              <Input id="name" {...form.register('name')} />
              {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type d'équipement</Label>
                <Controller
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EquipmentType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.type && <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="serialNumber">Numéro de série (Optionnel)</Label>
                <Input id="serialNumber" {...form.register('serialNumber')} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="photo">Photo {isEditMode && "(Optionnel: laisser vide pour garder l'ancienne)"}</Label>
              <Input id="photo" type="file" accept="image/*" {...form.register('photo')} />
              {form.formState.errors.photo && <p className="text-sm text-destructive">{form.formState.errors.photo.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DatePicker name="purchaseDate" label="Date d'achat" />
              <DatePicker name="serviceStartDate" label="Date de mise en service" />
            </div>
             
            <div className="grid grid-cols-2 gap-4 items-end">
                <div className="grid gap-2">
                    <Label htmlFor="lifespanInYears">Durée de vie (ans)</Label>
                    <Input id="lifespanInYears" type="number" {...form.register('lifespanInYears')} />
                    {form.formState.errors.lifespanInYears && <p className="text-sm text-destructive">{form.formState.errors.lifespanInYears.message as string}</p>}
                </div>
                <div className="grid gap-2">
                    <Label>Date de fin de vie prévue</Label>
                    <div className="text-sm font-medium h-10 flex items-center px-3 py-2 rounded-md border border-input bg-muted">
                        <p>{calculatedEol ? format(calculatedEol, 'PPP', { locale: fr }) : '...'}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Commentaires (description, usure, etc.)</Label>
              <Textarea id="description" {...form.register('description')} />
              {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manufacturerData">Données fabricant (Optionnel)</Label>
              <Textarea id="manufacturerData" placeholder="ex: marque, modèle, recommandations..." {...form.register('manufacturerData')} />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Controller control={form.control} name="archived" render={({ field }) => <Switch id="archived" checked={field.value} onCheckedChange={field.onChange} />} />
              <Label htmlFor="archived">Archiver cet équipement (ne sera plus actif)</Label>
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
