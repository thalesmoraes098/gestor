'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CommissionsTable } from "@/components/commissions-table";
import { CommissionsFilterDialog } from "@/components/commissions-filter-dialog";
import { ViewCommissionDialog } from "@/components/view-commission-dialog";
import { PerformanceReportChart } from "@/components/dashboard-charts";
import { useToast } from "@/hooks/use-toast";
import { Filter } from "lucide-react";

type Commission = {
  id: string;
  referenceMonth: string;
  recipientName: string;
  recipientType: 'Assessor' | 'Mensageiro';
  goal?: number;
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'Paga' | 'Pendente';
  paymentDate?: string;
};

const commissionsData: Commission[] = [
  { id: 'COM001', referenceMonth: 'Julho/2024', recipientName: 'Carlos Almeida', recipientType: 'Assessor', goal: 15000, baseAmount: 10000, commissionRate: 5, commissionAmount: 500, status: 'Paga', paymentDate: '2024-08-05' },
  { id: 'COM002', referenceMonth: 'Julho/2024', recipientName: 'Ana Beatriz', recipientType: 'Assessor', goal: 18000, baseAmount: 12500, commissionRate: 5.5, commissionAmount: 687.50, status: 'Pendente' },
  { id: 'COM003', referenceMonth: 'Julho/2024', recipientName: 'Fábio Souza', recipientType: 'Mensageiro', baseAmount: 5000, commissionRate: 2.5, commissionAmount: 125, status: 'Paga', paymentDate: '2024-08-05' },
  { id: 'COM004', referenceMonth: 'Junho/2024', recipientName: 'Carlos Almeida', recipientType: 'Assessor', goal: 15000, baseAmount: 9500, commissionRate: 5, commissionAmount: 475, status: 'Paga', paymentDate: '2024-07-05' },
  { id: 'COM005', referenceMonth: 'Junho/2024', recipientName: 'Hugo Costa', recipientType: 'Mensageiro', baseAmount: 0, commissionRate: 3, commissionAmount: 0, status: 'Paga', paymentDate: '2024-07-05' },
];

const advisorsData = [
  { id: 'ASS001', name: 'Carlos Almeida', email: 'carlos.almeida@example.com', phone: '(11) 98765-1111', commissionPercentage: 5, goal: 15000, status: 'Ativo' as const },
  { id: 'ASS002', name: 'Ana Beatriz', email: 'ana.beatriz@example.com', phone: '(21) 91234-2222', commissionPercentage: 5.5, goal: 18000, status: 'Ativo' as const },
];

type FilterFormValues = {
  recipientName?: string;
  recipientType?: "todos" | "assessor" | "mensageiro";
  status?: "todos" | "paga" | "pendente";
  startDate?: Date;
  endDate?: Date;
};

export default function ComissoesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false);
  const [commissionToView, setCommissionToView] = useState<Commission | null>(null);
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [chartTitle, setChartTitle] = useState('');
  const { toast } = useToast();

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

  const handleApplyFilters = (filters: FilterFormValues) => {
    setChartData(null);
    setChartTitle('');

    if (!filters.recipientName) {
      toast({ variant: 'destructive', title: "Filtro Incompleto", description: "Por favor, especifique um nome de colaborador para gerar o gráfico de desempenho." });
      return;
    }
    
    const assessor = advisorsData.find(a => a.name.toLowerCase() === filters.recipientName?.toLowerCase());

    if (!assessor || !assessor.goal || assessor.goal === 0) {
      toast({ title: "Gráfico não disponível", description: "O gráfico de desempenho só está disponível para assessores com meta definida." });
      return;
    }
    
    const commissionsInPeriod = commissionsData.filter(c => {
      const nameMatch = c.recipientName.toLowerCase() === filters.recipientName?.toLowerCase();
      if (!nameMatch) return false;
      
      if (filters.startDate || filters.endDate) {
          if (!c.paymentDate) return false;
          const paymentDate = new Date(c.paymentDate);
          const startDate = filters.startDate ? new Date(filters.startDate.setHours(0, 0, 0, 0)) : null;
          const endDate = filters.endDate ? new Date(filters.endDate.setHours(23, 59, 59, 999)) : null;

          if (startDate && paymentDate < startDate) return false;
          if (endDate && paymentDate > endDate) return false;
      }

      return true;
    });

    if (commissionsInPeriod.length === 0) {
      toast({ title: 'Nenhum dado', description: 'Nenhuma comissão encontrada para este colaborador no período selecionado.' });
      return;
    }
    
    const totalValue = commissionsInPeriod.reduce((sum, c) => sum + c.baseAmount, 0);

    setChartData([{ name: assessor.name, Resultado: totalValue, Meta: assessor.goal }]);
    setChartTitle(`Desempenho vs. Meta de ${assessor.name}`);
  }

  return (
    <>
      <CommissionsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={handleApplyFilters} />
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

        {chartData && (
          <Card className="rounded-2xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle>{chartTitle}</CardTitle>
              <CardDescription>
                Resultado do colaborador comparado com a meta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceReportChart data={chartData} />
            </CardContent>
          </Card>
        )}

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-0">
            <CommissionsTable data={commissionsData} onEdit={handleView} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
