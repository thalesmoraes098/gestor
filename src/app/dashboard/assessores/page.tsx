'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdvisorsTable } from "@/components/advisors-table";
import { AdvisorsFilterDialog } from "@/components/advisors-filter-dialog";
import { AddAdvisorDialog } from "@/components/add-advisor-dialog";
import { ReallocateClientsDialog } from "@/components/reallocate-clients-dialog";
import { Filter, PlusCircle } from "lucide-react";
import type { Advisor } from "@/lib/mock-data";
import { advisorsData } from "@/lib/mock-data";

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
