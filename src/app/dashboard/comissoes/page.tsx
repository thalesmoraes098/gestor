'use client';

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CommissionsTable } from "@/components/commissions-table";
import { CommissionsFilterDialog, type FilterFormValues } from "@/components/commissions-filter-dialog";
import { ViewCommissionDialog } from "@/components/view-commission-dialog";
import { PerformanceReportChart } from "@/components/dashboard-charts";
import { useToast } from "@/hooks/use-toast";
import { Filter } from "lucide-react";
import type { Commission, Donation, Advisor, Messenger, Donor } from "@/lib/mock-data";
import { collection, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { addMonths, subMonths, setDate } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Collaborator = {
  id: string;
  name: string;
  type: 'Assessor' | 'Mensageiro';
}

type CommissionPayment = {
  status: 'Paga';
  paymentDate: string;
};

export default function ComissoesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false);
  const [commissionToView, setCommissionToView] = useState<Commission | null>(null);
  const { toast } = useToast();

  const [filters, setFilters] = useState<FilterFormValues>({});
  
  // Firestore data states
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [messengers, setMessengers] = useState<Messenger[]>([]);
  const [commissionPayments, setCommissionPayments] = useState<Record<string, CommissionPayment>>({});
  const [loading, setLoading] = useState(true);
  const [closingDay, setClosingDay] = useState(5);

  useEffect(() => {
    setLoading(true);
    let loadedCount = 0;
    const totalToLoad = 6; // donations, donors, advisors, messengers, payments, settings
    const doneLoading = () => {
      loadedCount++;
      if (loadedCount === totalToLoad) {
        setLoading(false);
      }
    };

    const unsubDonations = onSnapshot(collection(db, "donations"), (snapshot) => {
      setDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donation)));
      doneLoading();
    });
    const unsubDonors = onSnapshot(collection(db, "donors"), (snapshot) => {
        setDonors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donor)));
        doneLoading();
    });
    const unsubAdvisors = onSnapshot(collection(db, "advisors"), (snapshot) => {
      setAdvisors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Advisor)));
      doneLoading();
    });
    const unsubMessengers = onSnapshot(collection(db, "messengers"), (snapshot) => {
      setMessengers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Messenger)));
      doneLoading();
    });
    const unsubPayments = onSnapshot(collection(db, "commission_payments"), (snapshot) => {
        const payments: Record<string, CommissionPayment> = {};
        snapshot.forEach(doc => {
            payments[doc.id] = doc.data() as CommissionPayment;
        });
        setCommissionPayments(payments);
        doneLoading();
    });
    const fetchSettings = async () => {
        const settingsRef = doc(db, "system_settings", "general");
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
            setClosingDay(parseInt(settingsSnap.data().closingDay || '5', 10));
        }
        doneLoading();
    };
    fetchSettings();
  
    return () => {
      unsubDonations();
      unsubDonors();
      unsubAdvisors();
      unsubMessengers();
      unsubPayments();
    };
  }, []);

  const allCollaborators: Collaborator[] = useMemo(() => [
    ...advisors.map(a => ({ id: a.id, name: a.name, type: 'Assessor' as const })),
    ...messengers.map(m => ({ id: m.id, name: m.name, type: 'Mensageiro' as const })),
  ], [advisors, messengers]);

  const commissionsData: Commission[] = useMemo(() => {
    if (loading) return [];
    const monthlyResults: { [key: string]: any } = {};

    donations.forEach(donation => {
      if (donation.status !== 'Pago' || !donation.paymentDate) return;

      const paymentDate = new Date(`${donation.paymentDate}T00:00:00Z`);
      
      let referenceMonthDate;
      const paymentDayOfMonth = paymentDate.getUTCDate();

      if (paymentDayOfMonth > closingDay) {
          referenceMonthDate = paymentDate;
      } else {
          referenceMonthDate = subMonths(paymentDate, 1);
      }

      const referenceMonth = referenceMonthDate.getUTCMonth();
      const referenceYear = referenceMonthDate.getUTCFullYear();
      
      const periodStartDate = setDate(new Date(Date.UTC(referenceYear, referenceMonth, 1)), closingDay + 1);
      const periodEndDate = setDate(addMonths(new Date(Date.UTC(referenceYear, referenceMonth, 1)), 1), closingDay);

      const monthYearKey = `${referenceMonth}/${referenceYear}`;
      
      const processCollaborator = (name: string, type: 'Assessor' | 'Mensageiro') => {
        if (!name) return;
        const key = `${name}-${type}-${monthYearKey}`;
        if (!monthlyResults[key]) {
          monthlyResults[key] = {
            recipientName: name,
            recipientType: type,
            referenceDate: new Date(Date.UTC(referenceYear, referenceMonth)),
            baseAmount: 0,
            id: key,
            periodStartDate,
            periodEndDate,
          };
        }
        monthlyResults[key].baseAmount += donation.amount;
      };

      processCollaborator(donation.assessor, 'Assessor');
      processCollaborator(donation.messenger, 'Mensageiro');
    });

    return Object.values(monthlyResults).map((result: any) => {
      let commissionRate = 0;
      let commissionAmount = 0;
      let advisorDetails: Advisor | undefined;
      const collaborator = allCollaborators.find(c => c.name === result.recipientName && c.type === result.recipientType);
      
      const paymentInfo = commissionPayments[result.id];
      let newClientsResult = 0;

      if (result.recipientType === 'Assessor') {
        advisorDetails = advisors.find(a => a.id === collaborator?.id);
        if (advisorDetails) {
          const goalMet = result.baseAmount >= advisorDetails.goal;
          commissionRate = goalMet ? advisorDetails.maxCommissionPercentage : advisorDetails.minCommissionPercentage;
          commissionAmount = result.baseAmount * (commissionRate / 100);

          newClientsResult = donors.filter(donor => {
              if (donor.assessor !== advisorDetails?.name || !donor.joinDate) return false;
              const joinDate = new Date(`${donor.joinDate}T00:00:00Z`);
              return joinDate >= result.periodStartDate && joinDate <= result.periodEndDate;
          }).length;
        }
      } else { 
        const messengerDetails = messengers.find(m => m.id === collaborator?.id);
        if (messengerDetails && messengerDetails.commissionPercentage) {
          commissionRate = messengerDetails.commissionPercentage;
          commissionAmount = result.baseAmount * (commissionRate / 100);
        }
      }

      return {
        ...result,
        referenceMonth: result.referenceDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
        recipientId: collaborator?.id || '',
        goal: advisorDetails?.goal,
        commissionRate,
        commissionAmount,
        status: paymentInfo ? 'Paga' : 'Pendente',
        paymentDate: paymentInfo ? paymentInfo.paymentDate : undefined,
        newClientsGoal: advisorDetails?.newClientsGoal,
        newClientsResult: newClientsResult,
        minCommissionPercentage: advisorDetails?.minCommissionPercentage,
        maxCommissionPercentage: advisorDetails?.maxCommissionPercentage,
      };
    });
  }, [donations, donors, advisors, messengers, allCollaborators, commissionPayments, loading, closingDay]);

  const { filteredCommissions, chartData, chartTitle, chartDescription } = useMemo(() => {
    let filteredData = commissionsData;
    let newChartData: any[] | null = null;
    let newChartTitle = 'Desempenho Geral vs. Metas';
    let newChartDescription = 'Resultados de todos os assessores com metas definidas.';

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

    const advisorsWithGoals = advisors.filter(a => a.goal > 0);

    if (filters.collaboratorId) {
      const collaborator = advisors.find(a => a.id === filters.collaboratorId);
      if (collaborator && collaborator.goal > 0) {
        const totalValue = commissionsData
          .filter(c => c.recipientId === filters.collaboratorId)
          .reduce((sum, c) => sum + c.baseAmount, 0);
        newChartData = [{ name: collaborator.name, Resultado: totalValue, Meta: collaborator.goal }];
        newChartTitle = `Desempenho vs. Meta de ${collaborator.name}`;
        newChartDescription = `Resultado do colaborador comparado com a meta.`;
      } else {
        newChartData = advisorsWithGoals.map(advisor => {
            const totalResult = commissionsData
              .filter(c => c.recipientId === advisor.id)
              .reduce((sum, c) => sum + c.baseAmount, 0);
            return { name: advisor.name, Resultado: totalResult, Meta: advisor.goal };
        });
        if (filters.collaboratorId) {
            toast({ title: "Gráfico não disponível", description: "O gráfico de desempenho só está disponível para assessores com meta definida. Exibindo desempenho geral." });
        }
      }
    } else {
      newChartData = advisorsWithGoals.map(advisor => {
        const totalResult = commissionsData
          .filter(c => c.recipientId === advisor.id)
          .reduce((sum, c) => sum + c.baseAmount, 0);
        return { name: advisor.name, Resultado: totalResult, Meta: advisor.goal };
      });
    }

    return { filteredCommissions: filteredData, chartData: newChartData, chartTitle: newChartTitle, chartDescription: newChartDescription };
  }, [filters, toast, commissionsData, advisors]);

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

  const handleMarkAsPaid = async (commissionId: string) => {
    try {
        await setDoc(doc(db, "commission_payments", commissionId), {
            status: 'Paga',
            paymentDate: new Date().toISOString().split('T')[0],
        });
        toast({
            title: 'Comissão Paga',
            description: 'A comissão foi marcada como paga com sucesso.',
        });
        setIsCommissionDialogOpen(false); // Close dialog on success
    } catch (error) {
        console.error("Error marking commission as paid: ", error);
        toast({
            variant: "destructive",
            title: 'Erro ao Pagar',
            description: 'Não foi possível marcar a comissão como paga.',
        });
    }
  }

  return (
    <>
      <CommissionsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={handleApplyFilters} collaborators={allCollaborators} />
      <ViewCommissionDialog open={isCommissionDialogOpen} onOpenChange={handleDialogChange} commission={commissionToView} onMarkAsPaid={handleMarkAsPaid} />
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
            {loading ? <Skeleton className="h-[250px] w-full" /> 
            : chartData && chartData.length > 0 ? (
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
             {loading ? (
              <div className="p-4">
                <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead><Skeleton className="h-5 w-[100px]" /></TableHead>
                          <TableHead><Skeleton className="h-5 w-[150px]" /></TableHead>
                          <TableHead><Skeleton className="h-5 w-[80px]" /></TableHead>
                          <TableHead className="hidden md:table-cell text-right"><Skeleton className="h-5 w-[100px] ml-auto" /></TableHead>
                          <TableHead className="hidden md:table-cell text-right"><Skeleton className="h-5 w-[100px] ml-auto" /></TableHead>
                          <TableHead className="hidden sm:table-cell text-right"><Skeleton className="h-5 w-[60px] ml-auto" /></TableHead>
                          <TableHead className="text-right"><Skeleton className="h-5 w-[100px] ml-auto" /></TableHead>
                          <TableHead className="hidden sm:table-cell text-center"><Skeleton className="h-5 w-[80px] mx-auto" /></TableHead>
                          <TableHead><span className="sr-only">Ações</span></TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {[...Array(5)].map((_, i) => (
                          <TableRow key={i}>
                              <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                              <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full ml-auto" /></TableCell>
                              <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full ml-auto" /></TableCell>
                              <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-full ml-auto" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-full ml-auto" /></TableCell>
                              <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-full mx-auto" /></TableCell>
                              <TableCell className="text-right"><Skeleton className="h-6 w-6 ml-auto" /></TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
             ) 
             : <CommissionsTable data={filteredCommissions} onEdit={handleView} />}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
