'use client';

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DonationsTable } from "@/components/donations-table";
import { DonationsFilterDialog, type FilterFormValues } from "@/components/donations-filter-dialog";
import { AddDonationDialog } from "@/components/add-donation-dialog";
import { Filter, PlusCircle } from "lucide-react";
import type { Donation } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { 
  donations as mockDonations, 
  donors as mockDonors, 
  advisors as mockAdvisors, 
  messengers as mockMessengers 
} from "@/lib/mock-data";

type DonorOption = { id: string; name: string; code: string; assessor?: string; };
type CollaboratorOption = { name: string };

export default function DoacoesPage() {
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>(mockDonations);
  const [advisors, setAdvisors] = useState<CollaboratorOption[]>(mockAdvisors);
  const [messengers, setMessengers] = useState<CollaboratorOption[]>(mockMessengers);
  const [donors, setDonors] = useState<DonorOption[]>(mockDonors);
  
  const [filters, setFilters] = useState<FilterFormValues>({ status: 'todos' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const [donationToEdit, setDonationToEdit] = useState<Donation | null>(null);

  const filteredDonations = useMemo(() => {
    return donations.filter(donation => {
      let matches = true;
      if (filters.status && filters.status !== 'todos') {
        matches = matches && donation.status.toLowerCase() === filters.status;
      }
      if (filters.assessor && filters.assessor !== 'todos' && donation.assessor) {
        matches = matches && donation.assessor === filters.assessor;
      }
      if (filters.messenger && filters.messenger !== 'todos' && donation.messenger) {
        matches = matches && donation.messenger === filters.messenger;
      }
      if (filters.startDate) {
        const startDate = new Date(filters.startDate.setHours(0, 0, 0, 0));
        matches = matches && new Date(donation.dueDate) >= startDate;
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate.setHours(23, 59, 59, 999));
        matches = matches && new Date(donation.dueDate) <= endDate;
      }
      if (filters.minAmount !== undefined) {
        matches = matches && donation.amount >= filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        matches = matches && donation.amount <= filters.maxAmount;
      }
      return matches;
    });
  }, [donations, filters]);

  const handleApplyFilters = (newFilters: FilterFormValues) => {
    setFilters(newFilters);
  };

  const handleEdit = (donation: Donation) => {
    setDonationToEdit(donation);
    setIsDonationDialogOpen(true);
  };

  const handleAdd = () => {
    setDonationToEdit(null);
    setIsDonationDialogOpen(true);
  };

  const handleDelete = async (donationId: string) => {
    if (window.confirm('Tem certeza de que deseja excluir esta doação?')) {
        setDonations(donations.filter(d => d.id !== donationId));
        toast({
            title: 'Doação Excluída',
            description: 'A doação foi removida com sucesso.',
        });
    }
  };
  
  const handleSave = async (data: any) => {
    setIsDonationDialogOpen(false);
    const isEditing = !!data.id;

    try {
        if (isEditing) {
            setDonations(donations.map(d => d.id === data.id ? { ...d, ...data } : d));
            toast({ title: 'Doação Atualizada', description: 'Os dados da doação foram atualizados.' });
        } else {
            const newDonation = { ...data, id: `don_${Date.now()}`};
            setDonations([...donations, newDonation]);
            toast({ title: 'Doação Adicionada', description: 'A nova doação foi registrada com sucesso.' });
        }
    } catch (error) {
        console.error("Error saving donation: ", error);
        toast({
            variant: "destructive",
            title: 'Erro ao Salvar',
            description: 'Não foi possível salvar os dados da doação.',
        });
    }
  };

  const handleDialogChange = (open: boolean) => {
      setIsDonationDialogOpen(open);
      if (!open) {
          setDonationToEdit(null);
      }
  }

  return (
    <>
      <DonationsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={handleApplyFilters} advisors={advisors} messengers={messengers} />
      <AddDonationDialog 
        open={isDonationDialogOpen} 
        onOpenChange={handleDialogChange} 
        donation={donationToEdit} 
        onSave={handleSave}
        donors={donors}
        advisors={advisors}
        messengers={messengers}
      />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Doações</h1>
            <p className="text-muted-foreground">Gerencie as doações recebidas.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-12 rounded-lg text-base" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </Button>
            <Button className="h-12 rounded-lg font-semibold text-base" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Doação
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-0">
            <DonationsTable data={filteredDonations} onEdit={handleEdit} onDelete={handleDelete} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
