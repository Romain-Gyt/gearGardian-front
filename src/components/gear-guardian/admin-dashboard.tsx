'use client'

import * as React from 'react'
import {
  getAllEquipment,
  saveEquipmentAdmin,
  deleteEquipmentAdmin,
  uploadEquipmentPhoto,
  triggerAlerts,
} from '@/lib/api'
import { getCurrentUser } from '@/lib/api/auth'
import type { EPIResponse, AdminEPIRequestPayload } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Loader2, PlusCircle, Trash2, Pencil } from 'lucide-react'
import { AdminEquipmentSheet } from './admin-equipment-sheet'

export function AdminDashboard() {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(true)
  const [equipment, setEquipment] = React.useState<EPIResponse[]>([])
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<EPIResponse | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10

  const [authorized, setAuthorized] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    getCurrentUser()
      .then((me) => {
        if (me.role !== 'ADMIN') {
          setAuthorized(false)
          return
        }
        setAuthorized(true)
        fetchEquipment()
      })
      .catch(() => setAuthorized(false))
  }, [])

  const fetchEquipment = async () => {
    setLoading(true)
    try {
      const data = await getAllEquipment()
      setEquipment(data)
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Impossible de charger les EPI.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (
    payload: AdminEPIRequestPayload,
    file: File | null,
    id?: string,
  ) => {
    setLoading(true)
    try {
      const saved = await saveEquipmentAdmin(payload, id)
      if (!id && file && saved) {
        await uploadEquipmentPhoto(saved.id, file)
      } else if (id && file) {
        await uploadEquipmentPhoto(id, file)
      }
      toast({ title: 'Enregistré' })
      await fetchEquipment()
      setIsSheetOpen(false)
      setEditingItem(null)
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "L'enregistrement a échoué.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      await deleteEquipmentAdmin(id)
      toast({ title: 'Supprimé' })
      fetchEquipment()
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'La suppression a échoué.' })
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(equipment.length / itemsPerPage)
  const paginated = equipment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  if (authorized === false) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Accès interdit</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline">Administration</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter
          </Button>
          <Button variant="secondary" onClick={() => triggerAlerts().then(() => toast({ title: 'Alertes déclenchées' })).catch(() => toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de déclencher les alertes.' }))}>Déclencher les alertes</Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Usure (%)</TableHead>
                <TableHead>Fin de vie prévue</TableHead>
                <TableHead>Archivé</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell>{eq.name}</TableCell>
                  <TableCell>{eq.type}</TableCell>
                  <TableCell>{eq.percentageUsed}</TableCell>
                  <TableCell>
                    {new Date(eq.expectedEndOfLife).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{eq.archived ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>
                    {new Date(eq.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{eq.userId}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => {
                        setEditingItem(eq)
                        setIsSheetOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(eq.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <span className="self-center text-sm">
                Page {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}
      <AdminEquipmentSheet
        isOpen={isSheetOpen}
        onOpenChange={(o) => {
          if (!o) setEditingItem(null)
          setIsSheetOpen(o)
        }}
        onSave={handleSave}
        initialData={editingItem as any}
        isLoading={loading}
      />
    </div>
  )
}
