'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Download, ChevronsUpDown, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PerformanceReportChart } from '@/components/dashboard-charts';
import { savedClosingDay } from '../configuracoes/page';
import { allCollaborators, advisorsData, messengersData, commissionsData } from '@/lib/mock-data';

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
        ? advisorsData.find(a => a.id === collaborator.id)
        : messengersData.find(m => m.id === collaborator.id);

    if (!fullCollaboratorData) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Dados detalhados do colaborador não encontrados.' });
        return;
    }

    const monthIndex = parseInt(data.month, 10);
    const year = parseInt(data.year, 10);
    const closingDay = parseInt(savedClosingDay, 10);

    const startDate = new Date(year, monthIndex - 1, closingDay);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(year, monthIndex, closingDay - 1);
    endDate.setHours(23, 59, 59, 999);

    const commissionsInPeriod = commissionsData.filter(c => {
      if (!c.paymentDate) return false;
      const paymentDate = new Date(c.paymentDate);
      return (
        c.recipientName === collaborator.name &&
        paymentDate >= startDate &&
        paymentDate <= endDate
      );
    });

    if (commissionsInPeriod.length === 0) {
      toast({ title: 'Nenhum dado', description: 'Nenhuma comissão encontrada para este colaborador no período selecionado.' });
      return;
    }
    
    const totalValue = commissionsInPeriod.reduce((sum, c) => sum + c.baseAmount, 0);
    const totalCommission = commissionsInPeriod.reduce((sum, c) => sum + c.commissionAmount, 0);
    const totalNewClients = commissionsInPeriod.reduce((sum, c) => sum + (c.newClientsResult || 0), 0);
    
    if (collaborator.type === 'Assessor' && 'goal' in fullCollaboratorData && fullCollaboratorData.goal > 0) {
        const goal = fullCollaboratorData.goal;
        setChartData([{ name: collaborator.name, Resultado: totalValue, Meta: goal }]);
        setChartTitle(`Desempenho vs. Meta de ${collaborator.name}`);
    } else if (collaborator.type === 'Assessor') {
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
      head: [['Data Pag.', 'Valor Base', 'Comissão', 'Taxa Aplicada']],
      body: commissionsInPeriod.map(c => [
        c.paymentDate ? format(new Date(c.paymentDate), 'dd/MM/yyyy') : '-',
        formatCurrency(c.baseAmount),
        formatCurrency(c.commissionAmount),
        `${c.commissionRate.toFixed(1)}%`
      ]),
      theme: 'striped',
    });
    
    const finalY2 = (doc as any).lastAutoTable.finalY;

    doc.setFontSize(12);
    doc.text('Resumo do Período', 14, finalY2 + 15);
    
    let summaryText = `Valor Total (Vendas/Coletas): ${formatCurrency(totalValue)}\nComissão Total: ${formatCurrency(totalCommission)}`;

    if (collaborator.type === 'Assessor' && 'goal' in fullCollaboratorData && fullCollaboratorData.goal > 0) {
        const goal = fullCollaboratorData.goal;
        const goalMet = totalValue >= goal;
        const achievement = (totalValue / goal) * 100;
        const appliedCommission = goalMet ? fullCollaboratorData.maxCommissionPercentage : fullCollaboratorData.minCommissionPercentage;
        
        summaryText += `\nResultado (Clientes): ${totalNewClients} / ${fullCollaboratorData.newClientsGoal}`;
        summaryText += `\n\nMeta Arrecadação: ${formatCurrency(goal)}`;
        summaryText += `\nDesempenho da Meta: ${achievement.toFixed(2)}% (${goalMet ? 'Atingida' : 'Não Atingida'})`;
        summaryText += `\nComissão Aplicada: ${appliedCommission?.toFixed(1)}% (${goalMet ? 'Máxima' : 'Mínima'})`;
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
