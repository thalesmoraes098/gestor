'use client';

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdvisorsTable } from "@/components/advisors-table";
import { AdvisorsFilterDialog, type FilterFormValues } from "@/components/advisors-filter-dialog";
import { AddAdvisorDialog } from "@/components/add-advisor-dialog";
import { ReallocateClientsDialog } from "@/components/reallocate-clients-dialog";
import { Filter, PlusCircle } from "lucide-react";
import type { Advisor } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { advisors as mockAdvisors } from "@/lib/mock-data";

export default function AssessoresPage() {
  const { toast } = useToast();
  const [advisors, setAdvisors] = useState<Advisor[]>(mockAdvisors);
  const [filters, setFilters] = useState<FilterFormValues>({ status: 'todos' });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAdvisorDialogOpen, setIsAdvisorDialogOpen] = useState(false);
  const [advisorToEdit, setAdvisorToEdit] = useState<Advisor | null>(null);
  const [isReallocationDialogOpen, setIsReallocationDialogOpen] = useState(false);
  const [dismissedAdvisor, setDismissedAdvisor] = useState<Advisor | null>(null);

  const activeAdvisors = useMemo(() => 
    advisors.filter(
      (a) => a.status === 'Ativo' && a.id !== dismissedAdvisor?.id
    ), [advisors, dismissedAdvisor]);

  const filteredAdvisors = useMemo(() => {
    return advisors.filter(advisor => {
      if (filters.status === 'todos') return true;
      return advisor.status.toLowerCase() === filters.status;
    });
  }, [advisors, filters]);

  const handleApplyFilters = (newFilters: FilterFormValues) => {
    setFilters(newFilters);
  };

  const handleEdit = (advisor: Advisor) => {
    setAdvisorToEdit(advisor);
    setIsAdvisorDialogOpen(true);
  };

  const handleAdd = () => {
    setAdvisorToEdit(null);
    setIsAdvisorDialogOpen(true);
  };

  const handleSave = async (data: Omit<Advisor, 'id'> & { id?: string }) => {
    setIsAdvisorDialogOpen(false);
    const isEditing = !!data.id;

    try {
      if (isEditing) {
        if (data.status === 'Demitido' && advisorToEdit?.status !== 'Demitido') {
            const dismissedData = { ...advisorToEdit, ...data, id: data.id! } as Advisor
            setDismissedAdvisor(dismissedData);
            setIsReallocationDialogOpen(true);
            setAdvisors(advisors.map(a => a.id === data.id ? { ...a, ...data } : a));
            toast({ title: 'Assessor Atualizado', description: 'Reatribua a carteira de clientes.' });
        } else {
            setAdvisors(advisors.map(a => a.id === data.id ? { ...a, ...data } : a));
            toast({ title: 'Assessor Atualizado', description: 'Os dados do assessor foram atualizados.' });
        }
      } else {
        const newAdvisor = { ...data, id: `adv_${Date.now()}` };
        setAdvisors([...advisors, newAdvisor]);
        toast({ title: 'Assessor Adicionado', description: 'O novo assessor foi registrado com sucesso.' });
      }
    } catch (error) {
        console.error("Error saving advisor: ", error);
        toast({
          variant: "destructive",
          title: 'Erro ao Salvar',
          description: 'Não foi possível salvar os dados do assessor.',
        });
    }
    setAdvisorToEdit(null);
  };

  const handleReallocationConfirm = async (reallocationData: { option: string; specificAdvisorId?: string }) => {
    if (!dismissedAdvisor) return;

    // This is a placeholder for the actual logic which would reassign clients.
    // For now, it just shows a success message.
    toast({ title: 'Operação Concluída', description: `O assessor ${dismissedAdvisor.name} foi demitido e a carteira de clientes foi reatribuída com sucesso (simulado).` });

    setIsReallocationDialogOpen(false);
    setDismissedAdvisor(null);
  };

  const handleDialogChange = (open: boolean) => {
      setIsAdvisorDialogOpen(open);
      if (!open) {
          setAdvisorToEdit(null);
      }
  }

  return (
    <>
      <AdvisorsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={handleApplyFilters} />
      <AddAdvisorDialog 
        open={isAdvisorDialogOpen} 
        onOpenChange={handleDialogChange} 
        advisor={advisorToEdit} 
        onSave={handleSave}
      />
      <ReallocateClientsDialog
        open={isReallocationDialogOpen}
        onOpenChange={setIsReallocationDialogOpen}
        dismissedAdvisor={dismissedAdvisor}
        activeAdvisors={activeAdvisors}
        onConfirm={handleReallocationConfirm}
      />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Assessores</h1>
            <p className="text-muted-foreground">Gerencie os assessores da sua organização.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-12 rounded-lg text-base" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </Button>
            <Button className="h-12 rounded-lg font-semibold text-base" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Assessor
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-0">
            <AdvisorsTable data={filteredAdvisors} onEdit={handleEdit} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
