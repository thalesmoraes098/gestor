'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdvisorsTable } from "@/components/advisors-table";
import { AdvisorsFilterDialog } from "@/components/advisors-filter-dialog";
import { AddAdvisorDialog } from "@/components/add-advisor-dialog";
import { ReallocateClientsDialog } from "@/components/reallocate-clients-dialog";
import { Filter, PlusCircle } from "lucide-react";

type Advisor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  commissionPercentage: number;
  goal: number;
  status: 'Ativo' | 'Férias' | 'Licença Médica' | 'Suspensão' | 'Demitido';
};

const advisorsData: Advisor[] = [
  { id: 'ASS001', name: 'Carlos Almeida', email: 'carlos.almeida@example.com', phone: '(11) 98765-1111', commissionPercentage: 5, goal: 15000, status: 'Ativo' },
  { id: 'ASS002', name: 'Ana Beatriz', email: 'ana.beatriz@example.com', phone: '(21) 91234-2222', commissionPercentage: 5.5, goal: 18000, status: 'Ativo' },
  { id: 'ASS003', name: 'Juliana Lima', email: 'juliana.lima@example.com', phone: '(51) 94444-3333', commissionPercentage: 6, goal: 20000, status: 'Demitido' },
  { id: 'ASS004', name: 'Marcos Ribeiro', email: 'marcos.ribeiro@example.com', phone: '(31) 99999-4444', commissionPercentage: 4.5, goal: 12000, status: 'Férias' },
  { id: 'ASS005', name: 'Ricardo Neves', email: 'ricardo.neves@example.com', phone: '(41) 98888-5555', commissionPercentage: 5.2, goal: 16000, status: 'Suspensão' },
];

export default function AssessoresPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAdvisorDialogOpen, setIsAdvisorDialogOpen] = useState(false);
  const [advisorToEdit, setAdvisorToEdit] = useState<Advisor | null>(null);
  const [isReallocationDialogOpen, setIsReallocationDialogOpen] = useState(false);
  const [dismissedAdvisor, setDismissedAdvisor] = useState<Advisor | null>(null);

  const activeAdvisors = advisorsData.filter(
    (a) => a.status === 'Ativo' && a.id !== dismissedAdvisor?.id
  );

  const handleEdit = (advisor: Advisor) => {
    setAdvisorToEdit(advisor);
    setIsAdvisorDialogOpen(true);
  };

  const handleAdd = () => {
    setAdvisorToEdit(null);
    setIsAdvisorDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
      setIsAdvisorDialogOpen(open);
      if (!open) {
          setAdvisorToEdit(null);
      }
  }
  
  const handleInitiateDismissal = (advisor: Advisor) => {
    setDismissedAdvisor(advisor);
    setIsReallocationDialogOpen(true);
  };

  return (
    <>
      <AdvisorsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} />
      <AddAdvisorDialog 
        open={isAdvisorDialogOpen} 
        onOpenChange={handleDialogChange} 
        advisor={advisorToEdit} 
        onInitiateDismissal={handleInitiateDismissal}
      />
      <ReallocateClientsDialog
        open={isReallocationDialogOpen}
        onOpenChange={setIsReallocationDialogOpen}
        dismissedAdvisor={dismissedAdvisor}
        activeAdvisors={activeAdvisors}
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
            <AdvisorsTable data={advisorsData} onEdit={handleEdit} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
