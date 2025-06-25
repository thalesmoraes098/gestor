'use client';

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DonorsTable } from "@/components/donors-table";
import { DonorsFilterDialog, type FilterFormValues } from "@/components/donors-filter-dialog";
import { AddDonorDialog } from "@/components/add-donor-dialog";
import { Filter, PlusCircle } from "lucide-react";
import type { Donor } from "@/lib/mock-data";
import { donorsData } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function DoadoresPage() {
  const { toast } = useToast();
  const [donors, setDonors] = useState<Donor[]>(donorsData);
  const [filters, setFilters] = useState<FilterFormValues>({ status: 'todos' });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDonorDialogOpen, setIsDonorDialogOpen] = useState(false);
  const [donorToEdit, setDonorToEdit] = useState<Donor | null>(null);

  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      let matches = true;
      if (filters.status && filters.status !== 'todos') {
        matches = matches && donor.status.toLowerCase() === filters.status;
      }
      if (filters.assessor && filters.assessor !== 'todos') {
        matches = matches && donor.assessor === filters.assessor;
      }
       if (filters.startDate) {
        const startDate = new Date(filters.startDate.setHours(0, 0, 0, 0));
        matches = matches && new Date(donor.joinDate) >= startDate;
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate.setHours(23, 59, 59, 999));
        matches = matches && new Date(donor.joinDate) <= endDate;
      }
      if (filters.minAmount !== undefined) {
        matches = matches && donor.amount >= filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        matches = matches && donor.amount <= filters.maxAmount;
      }
      return matches;
    });
  }, [donors, filters]);

  const handleApplyFilters = (newFilters: FilterFormValues) => {
    setFilters(newFilters);
  };

  const handleEdit = (donor: Donor) => {
    setDonorToEdit(donor);
    setIsDonorDialogOpen(true);
  };

  const handleAdd = () => {
    setDonorToEdit(null);
    setIsDonorDialogOpen(true);
  };

  const handleDelete = (donorId: string) => {
    if (window.confirm('Tem certeza de que deseja excluir este doador? Todos os dados associados serão perdidos.')) {
        setDonors(prev => prev.filter(d => d.id !== donorId));
        toast({
            title: 'Doador Excluído',
            description: 'O doador foi removido com sucesso.',
        });
    }
  };

  const handleSave = (data: Omit<Donor, 'id' | 'history' | 'amount'> & { id?: string }) => {
    const isEditing = !!data.id;
    if (isEditing) {
        setDonors(prev => prev.map(d => d.id === data.id ? { ...d, ...data } : d));
        toast({ title: 'Doador Atualizado', description: 'Os dados do doador foram atualizados.' });
    } else {
        const newDonor: Donor = { 
            ...data, 
            id: `DON${String(donors.length + 1).padStart(3, '0')}`,
            code: data.code || `DON${String(donors.length + 1).padStart(3, '0')}`,
            status: 'Ativo',
            amount: 0,
            joinDate: new Date().toISOString().split('T')[0],
            history: [],
        };
        setDonors(prev => [...prev, newDonor]);
        toast({ title: 'Doador Adicionado', description: 'O novo doador foi registrado com sucesso.' });
    }
    setIsDonorDialogOpen(false);
  };

  const handleDialogChange = (open: boolean) => {
      setIsDonorDialogOpen(open);
      if (!open) {
          setDonorToEdit(null);
      }
  }

  return (
    <>
      <DonorsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={handleApplyFilters} />
      <AddDonorDialog open={isDonorDialogOpen} onOpenChange={handleDialogChange} donor={donorToEdit} onSave={handleSave} />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Doadores</h1>
            <p className="text-muted-foreground">Gerencie os doadores da sua organização.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-12 rounded-lg text-base" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </Button>
            <Button className="h-12 rounded-lg font-semibold text-base" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Doador
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-0">
            <DonorsTable data={filteredDonors} onEdit={handleEdit} onDelete={handleDelete} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
