'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { Equipment } from '@/lib/types';

interface ExpirationBannerProps {
    equipment: Equipment[];
    threshold: number; // en pourcentage, ex. 80
}

export function ExpirationBanner({ equipment, threshold }: ExpirationBannerProps) {
    const expiringSoon = React.useMemo(() => {
        const now = Date.now();

        return equipment.filter((item) => {
            const start = new Date(item.serviceStartDate).getTime();
            const end   = new Date(item.expectedEndOfLife).getTime();
            if (now >= end) return false;            // déjà expiré ou archivé
            if (now < start) return false;           // pas encore en service

            const totalLife = end - start;
            const usedLife  = now - start;
            const usedPct   = (usedLife / totalLife) * 100;
            return usedPct >= threshold;             // dépasse le seuil
        });
    }, [equipment, threshold]);

    if (expiringSoon.length === 0) {
        return null;
    }

    return (
        <div className="rounded-lg bg-yellow-100 p-4 text-yellow-900 flex items-center justify-between">
            <p className="font-medium">
                ⚠️ {expiringSoon.length} {expiringSoon.length > 1 ? 'équipements arrivent' : "équipement arrive"} bientôt en fin de vie.
            </p>
            <Button size="sm" variant="outline" onClick={() => {
                // par exemple naviguer vers la liste filtrée
                window.location.href = '/dashboard?view=expiry';
            }}>
                Voir
            </Button>
        </div>
    );
}
