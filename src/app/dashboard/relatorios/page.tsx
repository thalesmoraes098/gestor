'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Download, ChevronsUpDown, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PerformanceReportChart } from '@/components/dashboard-charts';

// Mock data from other pages
const advisorsData = [
  { id: 'ASS001', name: 'Carlos Almeida', email: 'carlos.almeida@example.com', phone: '(11) 98765-1111', commissionPercentage: 5, goal: 15000, status: 'Ativo' as const },
  { id: 'ASS002', name: 'Ana Beatriz', email: 'ana.beatriz@example.com', phone: '(21) 91234-2222', commissionPercentage: 5.5, goal: 18000, status: 'Ativo' as const },
  { id: 'ASS003', name: 'Juliana Lima', email: 'juliana.lima@example.com', phone: '(51) 94444-3333', commissionPercentage: 6, goal: 20000, status: 'Demitido' as const },
  { id: 'ASS004', name: 'Marcos Ribeiro', email: 'marcos.ribeiro@example.com', phone: '(31) 99999-4444', commissionPercentage: 4.5, goal: 12000, status: 'Férias' as const },
  { id: 'ASS005', name: 'Ricardo Neves', email: 'ricardo.neves@example.com', phone: '(41) 98888-5555', commissionPercentage: 5.2, goal: 16000, status: 'Suspensão' as const },
];

const messengersData = [
  { id: 'MEN001', name: 'Fábio Souza', email: 'fabio.souza@example.com', phone: '(11) 91111-1111', status: 'Ativo' as const, commissionPercentage: 2.5 },
  { id: 'MEN002', name: 'Gabi Lima', email: 'gabi.lima@example.com', phone: '(21) 92222-2222', status: 'Ativo' as const },
  { id: 'MEN003', name: 'Hugo Costa', email: 'hugo.costa@example.com', phone: '(51) 93333-3333', status: 'Férias' as const, commissionPercentage: 3 },
  { id: 'MEN004', name: 'Leo Martins', email: 'leo.martins@example.com', phone: '(31) 94444-4444', status: 'Demitido' as const },
  { id: 'MEN005', name: 'Íris Alves', email: 'iris.alves@example.com', phone: '(41) 95555-5555', status: 'Licença Médica' as const },
];

const commissionsData = [
  { id: 'COM001', referenceMonth: 'Julho/2024', recipientName: 'Carlos Almeida', recipientType: 'Assessor' as const, goal: 15000, baseAmount: 10000, commissionRate: 5, commissionAmount: 500, status: 'Paga' as const, paymentDate: '2024-08-05' },
  { id: 'COM002', referenceMonth: 'Julho/2024', recipientName: 'Ana Beatriz', recipientType: 'Assessor' as const, goal: 18000, baseAmount: 12500, commissionRate: 5.5, commissionAmount: 687.50, status: 'Pendente' as const, paymentDate: '2024-07-25' },
  { id: 'COM003', referenceMonth: 'Julho/2024', recipientName: 'Fábio Souza', recipientType: 'Mensageiro' as const, baseAmount: 5000, commissionRate: 2.5, commissionAmount: 125, status: 'Paga' as const, paymentDate: '2024-08-05' },
  { id: 'COM004', referenceMonth: 'Junho/2024', recipientName: 'Carlos Almeida', recipientType: 'Assessor' as const, goal: 15000, baseAmount: 9500, commissionRate: 5, commissionAmount: 475, status: 'Paga' as const, paymentDate: '2024-07-05' },
  { id: 'COM005', referenceMonth: 'Junho/2024', recipientName: 'Hugo Costa', recipientType: 'Mensageiro' as const, baseAmount: 0, commissionRate: 3, commissionAmount: 0, status: 'Paga' as const, paymentDate: '2024-07-05' },
];

const allCollaborators = [
  ...advisorsData.map(a => ({ id: a.id, name: a.name, type: 'Assessor' as const })),
  ...messengersData.map(m => ({ id: m.id, name: m.name, type: 'Mensageiro' as const })),
];

const reportSchema = z.object({
  collaboratorId: z.string({ required_error: 'Por favor, selecione um colaborador.' }),
  dateRange: z.object({
    from: z.date({ required_error: 'A data inicial é obrigatória.' }),
    to: z.date({ required_error: 'A data final é obrigatória.' }),
  }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function RelatoriosPage() {
  const { toast } = useToast();
  const [isCollaboratorPopoverOpen, setIsCollaboratorPopoverOpen] = useState(false);
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [chartTitle, setChartTitle] = useState('');

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
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

    const commissionsInPeriod = commissionsData.filter(c => {
      if (!c.paymentDate) return false;
      const paymentDate = new Date(c.paymentDate);
      // Adjust for timezone issues by comparing dates without time
      const startDate = new Date(data.dateRange.from.setHours(0, 0, 0, 0));
      const endDate = new Date(data.dateRange.to.setHours(23, 59, 59, 999));
      
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
    
    // Chart Data
    if (collaborator.type === 'Assessor' && 'goal' in fullCollaboratorData && fullCollaboratorData.goal > 0) {
        const goal = fullCollaboratorData.goal;
        setChartData([{ name: collaborator.name, Resultado: totalValue, Meta: goal }]);
        setChartTitle(`Desempenho vs. Meta de ${collaborator.name}`);
    } else if (collaborator.type === 'Assessor') {
        toast({ title: 'Gráfico não disponível', description: 'Gráficos de desempenho só estão disponíveis para assessores com meta definida.'})
    }
    
    // PDF Generation
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Relatório de Desempenho Individual', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Período: ${format(data.dateRange.from, 'dd/MM/yyyy')} a ${format(data.dateRange.to, 'dd/MM/yyyy')}`, 14, 30);
    
    autoTable(doc, {
      startY: 40,
      head: [['Colaborador', 'Função', 'Meta']],
      body: [
        [
            collaborator.name, 
            collaborator.type, 
            'goal' in fullCollaboratorData ? formatCurrency(fullCollaboratorData.goal ?? 0) : 'N/A'
        ]
      ],
      theme: 'striped',
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    autoTable(doc, {
      startY: finalY + 10,
      head: [['Data Pag.', 'Valor Base', 'Comissão']],
      body: commissionsInPeriod.map(c => [
        c.paymentDate ? format(new Date(c.paymentDate), 'dd/MM/yyyy', { timeZone: 'UTC' }) : '-',
        formatCurrency(c.baseAmount),
        formatCurrency(c.commissionAmount)
      ]),
      theme: 'striped',
    });
    
    const finalY2 = (doc as any).lastAutoTable.finalY;

    doc.setFontSize(12);
    doc.text('Resumo do Período', 14, finalY2 + 15);
    
    let summaryText = `Valor Total (Vendas/Coletas): ${formatCurrency(totalValue)}\nComissão Total: ${formatCurrency(totalCommission)}`;

    if (collaborator.type === 'Assessor' && 'goal' in fullCollaboratorData && fullCollaboratorData.goal > 0) {
        const goal = fullCollaboratorData.goal;
        const achievement = (totalValue / goal) * 100;
        summaryText += `\nMeta Mensal: ${formatCurrency(goal)}`;
        summaryText += `\nDesempenho da Meta: ${achievement.toFixed(2)}%`;

        if (achievement < 100) {
            summaryText += ` (Faltou ${formatCurrency(goal - totalValue)} para atingir a meta)`;
        } else {
            summaryText += ` (Superou a meta em ${formatCurrency(totalValue - goal)})`;
        }
    }

    doc.text(summaryText, 14, finalY2 + 22);

    doc.save(`relatorio_${collaborator.name.replace(/\s/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`);
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
          <CardDescription>Selecione um colaborador e o período para gerar o relatório em PDF.</CardDescription>
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
                  name="dateRange.from"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data Inicial</FormLabel>
                      <Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP", { locale: ptBR })) : (<span>Escolha a data</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateRange.to"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data Final</FormLabel>
                      <Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP", { locale: ptBR })) : (<span>Escolha a data</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>
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
