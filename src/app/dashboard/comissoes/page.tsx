'use client';

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CommissionsTable } from "@/components/commissions-table";
import { CommissionsFilterDialog, type FilterFormValues } from "@/components/commissions-filter-dialog";
import { ViewCommissionDialog } from "@/components/view-commission-dialog";
import { PerformanceReportChart } from "@/components/dashboard-charts";
import { useToast } from "@/hooks/use-toast";
import { Filter } from "lucide-react";
import type { Commission } from "@/lib/mock-data";
import { commissionsData, allCollaborators, advisorsData } from "@/lib/mock-data";

export default function ComissoesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false);
  const [commissionToView, setCommissionToView] = useState<Commission | null>(null);
  const { toast } = useToast();

  const [filters, setFilters] = useState<FilterFormValues>({});

  const { filteredCommissions, chartData, chartTitle, chartDescription } = useMemo(() => {
    let filteredData = commissionsData;
    let newChartData: any[] | null = null;
    let newChartTitle = 'Desempenho Geral vs. Metas';
    let newChartDescription = 'Resultados de todos os assessores com metas definidas.';

    // Apply filters to table data
    if (filters.collaboratorId) {
      filteredData = filteredData.filter(c => c.recipientId === filters.collaboratorId);
    }
    if (filters.recipientType && filters.recipientType !== 'todos') {
      filteredData = filteredData.filter(c => c.recipientType.toLowerCase() === filters.recipientType);
    }
    if (filters.status && filters.status !== 'todos') {
      filteredData = filteredData.filter(c => c.status.toLowerCase() === filters.status);
    }
    if (filters.startDate) {
        const startDate = new Date(filters.startDate.setHours(0, 0, 0, 0));
        filteredData = filteredData.filter(c => c.paymentDate && new Date(c.paymentDate) >= startDate);
    }
    if (filters.endDate) {
        const endDate = new Date(filters.endDate.setHours(23, 59, 59, 999));
        filteredData = filteredData.filter(c => c.paymentDate && new Date(c.paymentDate) <= endDate);
    }

    // Determine chart data and title based on filters
    if (filters.collaboratorId) {
      const collaborator = advisorsData.find(a => a.id === filters.collaboratorId);
      if (collaborator && collaborator.goal > 0) {
        const totalValue = filteredData.reduce((sum, c) => sum + c.baseAmount, 0);
        newChartData = [{ name: collaborator.name, Resultado: totalValue, Meta: collaborator.goal }];
        newChartTitle = `Desempenho vs. Meta de ${collaborator.name}`;
        newChartDescription = `Resultado do colaborador comparado com a meta.`;
      } else {
        const advisorsWithGoals = advisorsData.filter(a => a.goal > 0);
        newChartData = advisorsWithGoals.map(advisor => {
            const advisorCommissions = commissionsData.filter(c => c.recipientId === advisor.id);
            const totalResult = advisorCommissions.reduce((sum, c) => sum + c.baseAmount, 0);
            return { name: advisor.name, Resultado: totalResult, Meta: advisor.goal };
        });
        if (filters.collaboratorId) { // If a collaborator without goal was selected
            toast({ title: "Gráfico não disponível", description: "O gráfico de desempenho só está disponível para assessores com meta definida. Exibindo desempenho geral." });
        }
      }
    } else {
      // General performance chart, potentially filtered by date
      const advisorsWithGoals = advisorsData.filter(a => a.goal > 0);
      newChartData = advisorsWithGoals.map(advisor => {
        const advisorCommissions = filteredData.filter(c => c.recipientId === advisor.id);
        const totalResult = advisorCommissions.reduce((sum, c) => sum + c.baseAmount, 0);
        return { name: advisor.name, Resultado: totalResult, Meta: advisor.goal };
      });
    }

    return { filteredCommissions: filteredData, chartData: newChartData, chartTitle: newChartTitle, chartDescription: newChartDescription };
  }, [filters, toast]);


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

  const handleApplyFilters = (newFilters: FilterFormValues) => {
    setFilters(newFilters);
  }

  return (
    <>
      <CommissionsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={handleApplyFilters} collaborators={allCollaborators} />
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
          <CardHeader>
            <CardTitle>{chartTitle}</CardTitle>
            <CardDescription>{chartDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData && chartData.length > 0 ? (
                <PerformanceReportChart data={chartData} />
            ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                    Nenhum dado de desempenho para exibir com os filtros atuais.
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-0">
            <CommissionsTable data={filteredCommissions} onEdit={handleView} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
