'use client';

import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { Equipment } from '@/lib/types';
import { X } from 'lucide-react';

interface ExpirationBannerProps {
  equipment: Equipment[];
  /** Alert threshold percentage from user profile */
  threshold?: number;
}

export function ExpirationBanner({ equipment, threshold = 80 }: ExpirationBannerProps) {
  const [isDismissed, setIsDismissed] = React.useState(false);

  const expiringSoon = React.useMemo(() => {
    return equipment.filter(item => {
      if (item.archived) return false;
      const now = Date.now();
      const startTime = new Date(item.serviceStartDate).getTime();
      const endTime = new Date(item.expectedEndOfLife).getTime();
      if (now > endTime) return false; // already expired
      const totalLifespan = endTime - startTime;
      const timeElapsed = now - startTime;
      const percentageUsed = totalLifespan > 0 ? Math.min(100, (timeElapsed / totalLifespan) * 100) : 0;
      return percentageUsed >= threshold;
    });
  }, [equipment, threshold]);

  if (isDismissed || expiringSoon.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="relative pr-10">
      <AlertTitle>Attention : Équipement arrivant à expiration !</AlertTitle>
      <AlertDescription>
        Les équipements suivants approchent de leur fin de vie : {expiringSoon.map(e => e.name).join(', ')}. Pensez à les inspecter ou à les remplacer.
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={() => setIsDismissed(true)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Fermer</span>
      </Button>
    </Alert>
  );
}
