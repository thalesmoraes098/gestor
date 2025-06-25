'use client';

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessengersTable } from "@/components/messengers-table";
import { MessengersFilterDialog, type FilterFormValues } from "@/components/messengers-filter-dialog";
import { AddMessengerDialog } from "@/components/add-messenger-dialog";
import { Filter, PlusCircle } from "lucide-react";
import type { Messenger } from "@/lib/mock-data";
import { messengersData } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function MensageirosPage() {
  const { toast } = useToast();
  const [messengers, setMessengers] = useState<Messenger[]>(messengersData);
  const [filters, setFilters] = useState<FilterFormValues>({ status: 'todos' });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMessengerDialogOpen, setIsMessengerDialogOpen] = useState(false);
  const [messengerToEdit, setMessengerToEdit] = useState<Messenger | null>(null);

  const filteredMessengers = useMemo(() => {
    return messengers.filter(messenger => {
      if (filters.status === 'todos') return true;
      return messenger.status.toLowerCase() === filters.status;
    });
  }, [messengers, filters]);

  const handleApplyFilters = (newFilters: FilterFormValues) => {
    setFilters(newFilters);
  };

  const handleEdit = (messenger: Messenger) => {
    setMessengerToEdit(messenger);
    setIsMessengerDialogOpen(true);
  };

  const handleAdd = () => {
    setMessengerToEdit(null);
    setIsMessengerDialogOpen(true);
  };

  const handleDelete = (messengerId: string) => {
    if (window.confirm('Tem certeza de que deseja excluir este mensageiro?')) {
      setMessengers(prev => prev.filter(m => m.id !== messengerId));
      toast({
        title: 'Mensageiro Excluído',
        description: 'O mensageiro foi removido com sucesso.',
      });
    }
  };
  
  const handleSave = (data: Omit<Messenger, 'id'> & { id?: string }) => {
    const isEditing = !!data.id;
    const finalData = { ...data };
    if (!finalData.receivesCommission) {
      finalData.commissionPercentage = undefined;
    }

    if (isEditing) {
      setMessengers(prev => prev.map(m => m.id === finalData.id ? { ...m, ...finalData } : m));
      toast({ title: 'Mensageiro Atualizado', description: 'Os dados do mensageiro foram atualizados.' });
    } else {
      const newMessenger: Messenger = { ...finalData, id: `MEN${String(messengers.length + 1).padStart(3, '0')}` };
      setMessengers(prev => [...prev, newMessenger]);
      toast({ title: 'Mensageiro Adicionado', description: 'O novo mensageiro foi registrado com sucesso.' });
    }
    setIsMessengerDialogOpen(false);
  };

  const handleDialogChange = (open: boolean) => {
      setIsMessengerDialogOpen(open);
      if (!open) {
          setMessengerToEdit(null);
      }
  }

  return (
    <>
      <MessengersFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={handleApplyFilters} />
      <AddMessengerDialog 
        open={isMessengerDialogOpen} 
        onOpenChange={handleDialogChange} 
        messenger={messengerToEdit} 
        onSave={handleSave}
      />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mensageiros</h1>
            <p className="text-muted-foreground">Gerencie os mensageiros da sua organização.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-12 rounded-lg text-base" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </Button>
            <Button className="h-12 rounded-lg font-semibold text-base" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Mensageiro
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-0">
            <MessengersTable data={filteredMessengers} onEdit={handleEdit} onDelete={handleDelete} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
