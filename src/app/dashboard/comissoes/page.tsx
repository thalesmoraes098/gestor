'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CommissionsTable } from "@/components/commissions-table";
import { CommissionsFilterDialog } from "@/components/commissions-filter-dialog";
import { ViewCommissionDialog } from "@/components/view-commission-dialog";
import { Filter } from "lucide-react";

type Commission = {
  id: string;
  referenceMonth: string;
  recipientName: string;
  recipientType: 'Assessor' | 'Mensageiro';
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'Paga' | 'Pendente';
  paymentDate?: string;
};

const commissionsData: Commission[] = [
  { id: 'COM001', referenceMonth: 'Julho/2024', recipientName: 'Carlos Almeida', recipientType: 'Assessor', baseAmount: 10000, commissionRate: 5, commissionAmount: 500, status: 'Paga', paymentDate: '2024-08-05' },
  { id: 'COM002', referenceMonth: 'Julho/2024', recipientName: 'Ana Beatriz', recipientType: 'Assessor', baseAmount: 12500, commissionRate: 5.5, commissionAmount: 687.50, status: 'Pendente' },
  { id: 'COM003', referenceMonth: 'Julho/2024', recipientName: 'Fábio Souza', recipientType: 'Mensageiro', baseAmount: 5000, commissionRate: 2.5, commissionAmount: 125, status: 'Paga', paymentDate: '2024-08-05' },
  { id: 'COM004', referenceMonth: 'Junho/2024', recipientName: 'Carlos Almeida', recipientType: 'Assessor', baseAmount: 9500, commissionRate: 5, commissionAmount: 475, status: 'Paga', paymentDate: '2024-07-05' },
  { id: 'COM005', referenceMonth: 'Junho/2024', recipientName: 'Hugo Costa', recipientType: 'Mensageiro', baseAmount: 0, commissionRate: 3, commissionAmount: 0, status: 'Paga', paymentDate: '2024-07-05' },
];

export default function ComissoesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false);
  const [commissionToView, setCommissionToView] = useState<Commission | null>(null);

  const handleView = (commission: Commission) => {
    setCommissionToView(commission);
    setIsCommissionDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
      setIsCommissionDialogOpen(open);
      if (!open) {
          setCommissionToView(null);
      }
  }

  return (
    <>
      <CommissionsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} />
      <ViewCommissionDialog open={isCommissionDialogOpen} onOpenChange={handleDialogChange} commission={commissionToView} />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Comissões</h1>
            <p className="text-muted-foreground">Gerencie as comissões dos seus assessores e mensageiros.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-12 rounded-lg text-base" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-0">
            <CommissionsTable data={commissionsData} onEdit={handleView} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
