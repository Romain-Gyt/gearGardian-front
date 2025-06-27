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
import { useToast } from '@/hooks/use-toast';

const equipmentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  purchaseDate: z.date({ required_error: 'Purchase date is required' }),
  lifespanYears: z.coerce.number().min(1, 'Lifespan must be at least 1 year').max(50, 'Lifespan cannot exceed 50 years'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  manufacturerData: z.string().optional(),
  photo: z.any().refine(files => files?.length === 1, 'Photo is required.'),
});

type EquipmentFormValues = z.infer<typeof equipmentSchema>;

interface AddEquipmentSheetProps {
  children: React.ReactNode;
  onSave: (equipment: Equipment) => void;
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

export function AddEquipmentSheet({ children, onSave, isOpen, onOpenChange }: AddEquipmentSheetProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();
  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      lifespanYears: 10,
    },
  });

  const onSubmit = async (data: EquipmentFormValues) => {
    setIsSaving(true);
    try {
        const photoFile = data.photo[0];
        const photoDataUri = await fileToDataUri(photoFile);

        const newEquipment: Equipment = {
            id: `equip-${Date.now()}`,
            name: data.name,
            purchaseDate: data.purchaseDate,
            lifespanYears: data.lifespanYears,
            description: data.description,
            manufacturerData: data.manufacturerData || '',
            photoUrl: URL.createObjectURL(photoFile),
            photoDataUri: photoDataUri,
            photoAiHint: 'climbing gear'
        };
        onSave(newEquipment);
        form.reset();
    } catch (error) {
        console.error('Failed to add equipment', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to process the photo. Please try a different image.',
        });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SheetHeader>
            <SheetTitle className="font-headline">Add New Equipment</SheetTitle>
            <SheetDescription>
              Fill in the details of your new climbing gear. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Equipment Name</Label>
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
                    <Label>Purchase Date</Label>
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
                            {form.watch('purchaseDate') ? format(form.watch('purchaseDate'), 'PPP') : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
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
                    <Label htmlFor="lifespanYears">Lifespan (years)</Label>
                    <Input id="lifespanYears" type="number" {...form.register('lifespanYears')} />
                    {form.formState.errors.lifespanYears && (
                        <p className="text-sm text-destructive">{form.formState.errors.lifespanYears.message}</p>
                    )}
                </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description & Usage History</Label>
              <Textarea id="description" {...form.register('description')} />
               {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manufacturerData">Manufacturer Data (Optional)</Label>
              <Textarea
                id="manufacturerData"
                placeholder="e.g., brand, model, recommended retirement guidelines..."
                {...form.register('manufacturerData')}
              />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Equipment
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
