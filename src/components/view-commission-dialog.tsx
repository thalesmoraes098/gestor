'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const viewCommissionSchema = z.object({
  status: z.enum(['Paga', 'Pendente']),
  paymentDate: z.date().optional(),
}).refine(data => {
    if (data.status === 'Paga') {
        return !!data.paymentDate;
    }
    return true;
}, {
    message: "A data de pagamento é obrigatória para comissões pagas.",
    path: ["paymentDate"],
});

type ViewCommissionFormValues = z.infer<typeof viewCommissionSchema>;

const formatCurrency = (value?: number) => {
  if (value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function ViewCommissionDialog({ open, onOpenChange, commission }: { open: boolean; onOpenChange: (open: boolean) => void; commission?: any | null; }) {
  const form = useForm<ViewCommissionFormValues>({
    resolver: zodResolver(viewCommissionSchema),
  });

  useEffect(() => {
    if (commission) {
      form.reset({
        status: commission.status || 'Pendente',
        paymentDate: commission.paymentDate ? new Date(commission.paymentDate) : undefined,
      });
    }
  }, [commission, form]);

  const onSubmit = (data: ViewCommissionFormValues) => {
    console.log('Comissão atualizada:', { commissionId: commission.id, ...data });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  }

  if (!commission) return null;
  const isPaid = form.watch('status') === 'Paga';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Comissão</DialogTitle>
          <DialogDescription>
            Veja os detalhes da comissão e atualize o status do pagamento.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Beneficiário:</span>
            <span className="font-semibold text-right">{commission.recipientName} ({commission.recipientType})</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Mês de Referência:</span>
            <span className="font-semibold text-right">{commission.referenceMonth}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Valor Base:</span>
            <span className="font-semibold text-right">{formatCurrency(commission.baseAmount)}</span>
          </div>
           <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Taxa:</span>
            <span className="font-semibold text-right">{commission.commissionRate.toFixed(1)}%</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Valor da Comissão:</span>
            <span className="font-semibold text-right">{formatCurrency(commission.commissionAmount)}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
             <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Paga">Paga</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
            />
            {isPaid && (
                <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Data de Pagamento</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>
                                            {field.value ? (format(field.value, "dd/MM/yyyy")) : (<span>Selecione a data</span>)}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={handleCancel}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
