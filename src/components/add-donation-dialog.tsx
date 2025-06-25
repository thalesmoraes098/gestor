'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"


const addDonationSchema = z.object({
  donorId: z.string().min(1, { message: 'Selecione um doador.' }),
  amount: z.coerce.number().min(0.01, { message: 'O valor deve ser maior que zero.' }),
  dueDate: z.date({ required_error: "A data de vencimento é obrigatória." }),
  paymentDate: z.date().optional(),
  status: z.enum(['Pago', 'Pendente', 'Atrasado', 'Cancelado']),
  paymentMethod: z.enum(['Dinheiro', 'Cartão de Crédito', 'PIX']),
  assessor: z.string().optional(),
  messenger: z.string().optional(),
});

type AddDonationFormValues = z.infer<typeof addDonationSchema>;

const donors = [
    { id: 'DON001', name: 'João da Silva' },
    { id: 'DON002', name: 'Maria Oliveira' },
    { id: 'DON003', name: 'Carlos Pereira' },
    { id: 'DON004', name: 'Ana Costa' },
    { id: 'DON005', name: 'Pedro Santos' },
    { id: 'DON006', name: 'Sofia Lima' },
];
const assessors = ['Carlos Almeida', 'Ana Beatriz', 'Direto', 'Juliana Lima'];
const messengers = ['Fábio', 'Gabi', 'Hugo', 'Leo', 'Íris'];

const defaultFormValues: AddDonationFormValues = {
  donorId: '',
  amount: 0,
  dueDate: new Date(),
  status: 'Pendente',
  paymentMethod: 'Dinheiro',
  assessor: '',
  messenger: '',
};

export function AddDonationDialog({ open, onOpenChange, donation }: { open: boolean; onOpenChange: (open: boolean) => void; donation?: any | null; }) {
  const isEditMode = !!donation;

  const form = useForm<AddDonationFormValues>({
    resolver: zodResolver(addDonationSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (open) {
      if (isEditMode && donation) {
        // Here you would find the donor by donation.donorCode, but for now, we map by name.
        const donor = donors.find(d => d.name === donation.donorName);
        form.reset({
          donorId: donor?.id || '',
          amount: donation.amount || 0,
          dueDate: donation.dueDate ? new Date(donation.dueDate) : new Date(),
          paymentDate: donation.paymentDate ? new Date(donation.paymentDate) : undefined,
          status: donation.status || 'Pendente',
          paymentMethod: donation.paymentMethod || 'Dinheiro',
          assessor: donation.assessor || '',
          messenger: donation.messenger || '',
        });
      } else {
        form.reset(defaultFormValues);
      }
    }
  }, [open, donation, isEditMode, form]);

  const onSubmit = (data: AddDonationFormValues) => {
    console.log(isEditMode ? 'Doação atualizada:' : 'Nova doação:', data);
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Doação' : 'Adicionar Doação'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Atualize os dados da doação.' : 'Preencha os dados para registrar uma nova doação.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh]">
              <div className="grid gap-6 py-4 px-2 pr-6">
                <FormField control={form.control} name="donorId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doador</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione o doador" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {donors.map((donor) => (<SelectItem key={donor.id} value={donor.id}>{donor.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>

                <FormField control={form.control} name="amount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl><Input type="number" placeholder="R$ 0,00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="dueDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Data de Vencimento</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal h-10",!field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "dd/MM/yyyy")) : (<span>Selecione a data</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="paymentDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Data de Pagamento (Opcional)</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal h-10",!field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "dd/MM/yyyy")) : (<span>Selecione a data</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                </div>

                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Pago">Pago</SelectItem>
                        <SelectItem value="Atrasado">Atrasado</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>

                <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione a forma de pagamento" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="assessor" render={({ field }) => (
                        <FormItem><FormLabel>Assessor</FormLabel><Select onValueChange={field.onChange} value={field.value || ''}><FormControl><SelectTrigger><SelectValue placeholder="Selecione (Opcional)" /></SelectTrigger></FormControl><SelectContent>{assessors.map((assessor) => (<SelectItem key={assessor} value={assessor}>{assessor}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="messenger" render={({ field }) => (
                        <FormItem><FormLabel>Mensageiro</FormLabel><Select onValueChange={field.onChange} value={field.value || ''}><FormControl><SelectTrigger><SelectValue placeholder="Selecione (Opcional)" /></SelectTrigger></FormControl><SelectContent>{messengers.map((messenger) => (<SelectItem key={messenger} value={messenger}>{messenger}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={handleCancel}>Cancelar</Button>
              <Button type="submit">{isEditMode ? 'Salvar Alterações' : 'Salvar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
