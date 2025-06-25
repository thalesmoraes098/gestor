'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, getMonth, getYear } from 'date-fns';
import { Download, ChevronsUpDown, Check } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PerformanceReportChart } from '@/components/dashboard-charts';
import { savedClosingDay } from '@/lib/config';
import type { Advisor, Messenger, Donation, Commission } from '@/lib/mock-data';

const reportSchema = z.object({
  collaboratorId: z.string({ required_error: 'Por favor, selecione um colaborador.' }),
  month: z.string({ required_error: 'O mês é obrigatório.' }),
  year: z.string({ required_error: 'O ano é obrigatório.' }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const months = [
    { value: "0", label: "Janeiro" }, { value: "1", label: "Fevereiro" }, { value: "2", label: "Março" }, { value: "3", label: "Abril" },
    { value: "4", label: "Maio" }, { value: "5", label: "Junho" }, { value: "6", label: "Julho" }, { value: "7", label: "Agosto" },
    { value: "8", label: "Setembro" }, { value: "9", label: "Outubro" }, { value: "10", label: "Novembro" }, { value: "11", label: "Dezembro" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

export default function RelatoriosPage() {
  const { toast } = useToast();
  const [isCollaboratorPopoverOpen, setIsCollaboratorPopoverOpen] = useState(false);
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [chartTitle, setChartTitle] = useState('');
  
  // Firestore data
  const [donations, setDonations] = useState<Donation[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [messengers, setMessengers] = useState<Messenger[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubDonations = onSnapshot(collection(db, "donations"), (snapshot) => {
      setDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donation)));
    });
    const unsubAdvisors = onSnapshot(collection(db, "advisors"), (snapshot) => {
      setAdvisors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Advisor)));
    });
    const unsubMessengers = onSnapshot(collection(db, "messengers"), (snapshot) => {
      setMessengers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Messenger)));
      setLoading(false);
    });

    return () => {
      unsubDonations();
      unsubAdvisors();
      unsubMessengers();
    };
  }, []);

  const allCollaborators = [
    ...advisors.map(a => ({ id: a.id, name: a.name, type: 'Assessor' as const })),
    ...messengers.map(m => ({ id: m.id, name: m.name, type: 'Mensageiro' as const })),
  ];

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
        month: String(new Date().getMonth()),
        year: String(currentYear),
    }
  });

  const onSubmit = async (data: ReportFormValues) => {
    setChartData(null);
    setChartTitle('');
    
    const collaborator = allCollaborators.find(c => c.id === data.collaboratorId);
    if (!collaborator) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Colaborador não encontrado.' });
      return;
    }
    
    const fullCollaboratorData = collaborator.type === 'Assessor'
        ? advisors.find(a => a.id === collaborator.id)
        : messengers.find(m => m.id === collaborator.id);

    if (!fullCollaboratorData) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Dados detalhados do colaborador não encontrados.' });
        return;
    }

    const monthIndex = parseInt(data.month, 10);
    const year = parseInt(data.year, 10);
    const closingDay = parseInt(savedClosingDay, 10);

    const startDate = new Date(year, monthIndex, closingDay + 1);
    const endDate = new Date(year, monthIndex + 1, closingDay);

    const donationsInPeriod = donations.filter(d => {
      if (!d.paymentDate) return false;
      const paymentDate = new Date(d.paymentDate);
      const isCorrectCollaborator = (d.assessor === collaborator.name && collaborator.type === 'Assessor') || 
                                     (d.messenger === collaborator.name && collaborator.type === 'Mensageiro');
      return isCorrectCollaborator && d.status === 'Pago' && paymentDate >= startDate && paymentDate <= endDate;
    });

    if (donationsInPeriod.length === 0) {
      toast({ title: 'Nenhum dado', description: 'Nenhuma doação encontrada para este colaborador no período selecionado.' });
      return;
    }

    let commissionRate = 0;
    let commissionAmount = 0;
    const totalValue = donationsInPeriod.reduce((sum, d) => sum + d.amount, 0);

    if (collaborator.type === 'Assessor' && 'goal' in fullCollaboratorData) {
      const goalMet = totalValue >= fullCollaboratorData.goal;
      commissionRate = goalMet ? fullCollaboratorData.maxCommissionPercentage : fullCollaboratorData.minCommissionPercentage;
      commissionAmount = totalValue * (commissionRate / 100);
      setChartData([{ name: collaborator.name, Resultado: totalValue, Meta: fullCollaboratorData.goal }]);
      setChartTitle(`Desempenho vs. Meta de ${collaborator.name}`);
    } else if (collaborator.type === 'Mensageiro' && 'commissionPercentage' in fullCollaboratorData) {
      commissionRate = fullCollaboratorData.commissionPercentage || 0;
      commissionAmount = totalValue * (commissionRate / 100);
      toast({ title: 'Gráfico não disponível', description: 'Gráficos de desempenho só estão disponíveis para assessores com meta definida.'})
    }
    
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Relatório de Desempenho Individual', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Período: ${format(startDate, 'dd/MM/yyyy')} a ${format(endDate, 'dd/MM/yyyy')}`, 14, 30);
    
    if (collaborator.type === 'Assessor' && 'goal' in fullCollaboratorData) {
        autoTable(doc, {
            startY: 40,
            head: [['Colaborador', 'Função', 'Meta (R$)', 'Meta (Clientes)']],
            body: [[
                collaborator.name, 
                collaborator.type, 
                formatCurrency(fullCollaboratorData.goal ?? 0),
                fullCollaboratorData.newClientsGoal ?? 'N/A'
            ]],
            theme: 'striped',
        });
    } else {
         autoTable(doc, {
            startY: 40,
            head: [['Colaborador', 'Função']],
            body: [[ collaborator.name, collaborator.type ]],
            theme: 'striped',
        });
    }

    const finalY = (doc as any).lastAutoTable.finalY;

    autoTable(doc, {
      startY: finalY + 10,
      head: [['Data Pag.', 'Doador', 'Valor da Doação']],
      body: donationsInPeriod.map(d => [
        d.paymentDate ? format(new Date(d.paymentDate), 'dd/MM/yyyy') : '-',
        d.donorName,
        formatCurrency(d.amount),
      ]),
      theme: 'striped',
    });
    
    const finalY2 = (doc as any).lastAutoTable.finalY;

    doc.setFontSize(12);
    doc.text('Resumo do Período', 14, finalY2 + 15);
    
    let summaryText = `Total Arrecadado/Coletado: ${formatCurrency(totalValue)}\nComissão Calculada: ${formatCurrency(commissionAmount)}`;

    if (collaborator.type === 'Assessor' && 'goal' in fullCollaboratorData && fullCollaboratorData.goal > 0) {
        const goal = fullCollaboratorData.goal;
        const goalMet = totalValue >= goal;
        const achievement = (totalValue / goal) * 100;
        
        summaryText += `\n\nMeta Arrecadação: ${formatCurrency(goal)}`;
        summaryText += `\nDesempenho da Meta: ${achievement.toFixed(2)}% (${goalMet ? 'Atingida' : 'Não Atingida'})`;
        summaryText += `\nComissão Aplicada: ${commissionRate.toFixed(1)}% (${goalMet ? 'Máxima' : 'Mínima'})`;
    }

    doc.text(summaryText, 14, finalY2 + 22);

    const monthLabel = months.find(m => m.value === data.month)?.label.toLowerCase();
    doc.save(`relatorio_${collaborator.name.replace(/\s/g, '_')}_${monthLabel}_${data.year}.pdf`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">Gere relatórios de desempenho individuais.</p>
      </div>

      <Card className="rounded-2xl border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Gerar Relatório</CardTitle>
          <CardDescription>
            Selecione um colaborador e o período para gerar o relatório em PDF. O período será calculado com base no dia de fechamento definido nas configurações (Dia {savedClosingDay}).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <p>Carregando dados...</p> : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FormField
                    control={form.control}
                    name="collaboratorId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Colaborador</FormLabel>
                          <Popover open={isCollaboratorPopoverOpen} onOpenChange={setIsCollaboratorPopoverOpen}>
                              <PopoverTrigger asChild>
                                  <FormControl>
                                      <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                                          {field.value ? allCollaborators.find(c => c.id === field.value)?.name : "Selecione o colaborador"}
                                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                  </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                  <Command>
                                      <CommandInput placeholder="Buscar colaborador..." />
                                      <CommandList><CommandEmpty>Nenhum colaborador encontrado.</CommandEmpty>
                                      <CommandGroup>
                                          {allCollaborators.map((c) => (
                                              <CommandItem value={`${c.name} ${c.id}`} key={c.id} onSelect={() => { form.setValue("collaboratorId", c.id); setIsCollaboratorPopoverOpen(false); }}>
                                                  <Check className={cn("mr-2 h-4 w-4", c.id === field.value ? "opacity-100" : "opacity-0")} />
                                                  {c.name} ({c.type})
                                              </CommandItem>
                                          ))}
                                      </CommandGroup>
                                      </CommandList>
                                  </Command>
                              </PopoverContent>
                          </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="month"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Mês</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o mês" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ano</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o ano" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit">
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório PDF
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      
      {chartData && (
        <Card className="rounded-2xl border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{chartTitle}</CardTitle>
            <CardDescription>
              Gráfico comparando o resultado do colaborador com a meta estabelecida no período selecionado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceReportChart data={chartData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
