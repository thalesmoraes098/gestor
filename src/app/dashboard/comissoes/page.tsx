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

type Commission = {
  id: string;
  referenceMonth: string;
  recipientName: string;
  recipientId: string; // Add this to link back to the source
  recipientType: 'Assessor' | 'Mensageiro';
  goal?: number;
  baseAmount: number;
  commissionRate: number; // The applied rate
  commissionAmount: number;
  status: 'Paga' | 'Pendente';
  paymentDate?: string;
  // For context in dialogs
  newClientsGoal?: number;
  newClientsResult?: number;
  minCommissionPercentage?: number;
  maxCommissionPercentage?: number;
};

const advisorsData = [
  { id: 'ASS001', name: 'Carlos Almeida', email: 'carlos.almeida@example.com', phone: '(11) 98765-1111', minCommissionPercentage: 3, maxCommissionPercentage: 5, goal: 15000, newClientsGoal: 10, status: 'Ativo' as const },
  { id: 'ASS002', name: 'Ana Beatriz', email: 'ana.beatriz@example.com', phone: '(21) 91234-2222', minCommissionPercentage: 3.5, maxCommissionPercentage: 5.5, goal: 18000, newClientsGoal: 12, status: 'Ativo' as const },
];

const messengersData = [
  { id: 'MEN001', name: 'Fábio Souza', email: 'fabio.souza@example.com', phone: '(11) 91111-1111', status: 'Ativo' as const, commissionPercentage: 2.5 },
  { id: 'MEN002', name: 'Gabi Lima', email: 'gabi.lima@example.com', phone: '(21) 92222-2222', status: 'Ativo' as const },
  { id: 'MEN003', name: 'Hugo Costa', email: 'hugo.costa@example.com', phone: '(51) 93333-3333', status: 'Férias' as const, commissionPercentage: 3 },
  { id: 'MEN004', name: 'Leo Martins', email: 'leo.martins@example.com', phone: '(31) 94444-4444', status: 'Demitido' as const },
  { id: 'MEN005', name: 'Íris Alves', email: 'iris.alves@example.com', phone: '(41) 95555-5555', status: 'Licença Médica' as const },
];

// Source data for calculations
const monthlyResults = [
    { id: 'COM001', referenceMonth: 'Julho/2024', recipientName: 'Carlos Almeida', recipientType: 'Assessor' as const, baseAmount: 10000, newClientsResult: 8, status: 'Paga' as const, paymentDate: '2024-08-05' },
    { id: 'COM002', referenceMonth: 'Julho/2024', recipientName: 'Ana Beatriz', recipientType: 'Assessor' as const, baseAmount: 12500, newClientsResult: 13, status: 'Pendente' as const, paymentDate: undefined },
    { id: 'COM003', referenceMonth: 'Julho/2024', recipientName: 'Fábio Souza', recipientType: 'Mensageiro' as const, baseAmount: 5000, status: 'Paga' as const, paymentDate: '2024-08-05' },
    { id: 'COM004', referenceMonth: 'Junho/2024', recipientName: 'Carlos Almeida', recipientType: 'Assessor' as const, baseAmount: 9500, newClientsResult: 11, status: 'Paga' as const, paymentDate: '2024-07-05' },
    { id: 'COM005', referenceMonth: 'Junho/2024', recipientName: 'Hugo Costa', recipientType: 'Mensageiro' as const, baseAmount: 0, status: 'Paga' as const, paymentDate: '2024-07-05' },
    { id: 'COM006', referenceMonth: 'Junho/2024', recipientName: 'Ana Beatriz', recipientType: 'Assessor' as const, baseAmount: 20000, newClientsResult: 10, status: 'Paga' as const, paymentDate: '2024-07-05' },
];

const allCollaborators = [
  ...advisorsData.map(a => ({ id: a.id, name: a.name, type: 'Assessor' as const })),
  ...messengersData.map(m => ({ id: m.id, name: m.name, type: 'Mensageiro' as const })),
];

// This function simulates the automatic commission calculation by the system.
const calculateCommissions = (
    results: typeof monthlyResults,
    advisors: typeof advisorsData,
    messengers: typeof messengersData
): Commission[] => {
    return results.map(result => {
        let commissionRate = 0;
        let commissionAmount = 0;
        let advisorDetails: (typeof advisorsData)[0] | undefined;
        let collaboratorId = '';

        if (result.recipientType === 'Assessor') {
            advisorDetails = advisors.find(a => a.name === result.recipientName);
            if (advisorDetails) {
                collaboratorId = advisorDetails.id;
                const goalMet = result.baseAmount >= advisorDetails.goal;
                commissionRate = goalMet ? advisorDetails.maxCommissionPercentage : advisorDetails.minCommissionPercentage;
                commissionAmount = result.baseAmount * (commissionRate / 100);
            }
        } else { // Mensageiro
            const messengerDetails = messengers.find(m => m.name === result.recipientName);
            if (messengerDetails) {
                collaboratorId = messengerDetails.id;
                if (messengerDetails.commissionPercentage) {
                    commissionRate = messengerDetails.commissionPercentage;
                    commissionAmount = result.baseAmount * (commissionRate / 100);
                }
            }
        }
        
        return {
            id: result.id,
            referenceMonth: result.referenceMonth,
            recipientName: result.recipientName,
            recipientId: collaboratorId,
            recipientType: result.recipientType,
            goal: advisorDetails?.goal,
            baseAmount: result.baseAmount,
            commissionRate,
            commissionAmount,
            status: result.status,
            paymentDate: result.paymentDate,
            newClientsGoal: advisorDetails?.newClientsGoal,
            newClientsResult: result.newClientsResult,
            minCommissionPercentage: advisorDetails?.minCommissionPercentage,
            maxCommissionPercentage: advisorDetails?.maxCommissionPercentage,
        };
    });
};

const commissionsData: Commission[] = calculateCommissions(monthlyResults, advisorsData, messengersData);

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
