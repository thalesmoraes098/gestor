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
import { advisorsData } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function AssessoresPage() {
  const { toast } = useToast();
  const [advisors, setAdvisors] = useState<Advisor[]>(advisorsData);
  const [filters, setFilters] = useState<FilterFormValues>({ status: 'todos' });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAdvisorDialogOpen, setIsAdvisorDialogOpen] = useState(false);
  const [advisorToEdit, setAdvisorToEdit] = useState<Advisor | null>(null);
  const [isReallocationDialogOpen, setIsReallocationDialogOpen] = useState(false);
  const [dismissedAdvisor, setDismissedAdvisor] = useState<Advisor | null>(null);

  const activeAdvisors = advisors.filter(
    (a) => a.status === 'Ativo' && a.id !== dismissedAdvisor?.id
  );

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

  const handleDelete = (advisorId: string) => {
    if (window.confirm('Tem certeza de que deseja excluir este assessor? Esta ação não pode ser desfeita.')) {
      setAdvisors(prev => prev.filter(a => a.id !== advisorId));
      toast({
        title: 'Assessor Excluído',
        description: 'O assessor foi removido com sucesso.',
      });
    }
  };

  const handleSave = (data: Omit<Advisor, 'id'> & { id?: string }) => {
    const isEditing = !!data.id;
    if (isEditing) {
      if (data.status === 'Demitido' && advisorToEdit?.status !== 'Demitido') {
        setDismissedAdvisor({ ...advisorToEdit, ...data } as Advisor);
        setIsReallocationDialogOpen(true);
      } else {
        setAdvisors(prev => prev.map(a => a.id === data.id ? { ...a, ...data } : a));
        toast({ title: 'Assessor Atualizado', description: 'Os dados do assessor foram atualizados.' });
      }
    } else {
      const newAdvisor: Advisor = { ...data, id: `ASS${String(advisors.length + 1).padStart(3, '0')}` };
      setAdvisors(prev => [...prev, newAdvisor]);
      toast({ title: 'Assessor Adicionado', description: 'O novo assessor foi registrado com sucesso.' });
    }
    setIsAdvisorDialogOpen(false);
  };

  const handleReallocationConfirm = (reallocationData: any) => {
      // Logic for reallocation would go here.
      console.log('Reallocation Confirmed:', reallocationData);
      if (dismissedAdvisor) {
        setAdvisors(prev => prev.map(a => a.id === dismissedAdvisor.id ? { ...a, status: 'Demitido' } : a));
        toast({ title: 'Assessor Demitido', description: `O assessor ${dismissedAdvisor.name} foi demitido e a carteira reatribuída.` });
      }
      setIsReallocationDialogOpen(false);
      setDismissedAdvisor(null);
  }

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
            <AdvisorsTable data={filteredAdvisors} onEdit={handleEdit} onDelete={handleDelete} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
