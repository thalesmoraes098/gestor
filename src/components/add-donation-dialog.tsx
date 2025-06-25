'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from "date-fns"
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react"

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import type { Donation } from '@/lib/mock-data';

const addDonationSchema = z.object({
  donorId: z.string().min(1, { message: 'Selecione um doador.' }),
  amount: z.coerce.number().min(0.01, { message: 'O valor deve ser maior que zero.' }),
  dueDate: z.date({ required_error: "A data de vencimento é obrigatória." }),
  paymentDate: z.date().optional(),
  status: z.enum(['Pago', 'Pendente', 'Atrasado', 'Cancelado']),
  paymentMethod: z.enum(['PIX', 'Transferência Bancária', 'Coleta', 'Dinheiro', 'Cartão de Crédito']),
  assessor: z.string().optional(),
  messenger: z.string().optional(),
}).refine(data => {
    if (data.status === 'Pago') {
        return !!data.paymentDate;
    }
    return true;
}, {
    message: "A data de pagamento é obrigatória para doações pagas.",
    path: ["paymentDate"],
});

type AddDonationFormValues = z.infer<typeof addDonationSchema>;

const defaultFormValues: Omit<AddDonationFormValues, 'dueDate'> & { dueDate?: Date } = {
  donorId: '',
  amount: 0,
  dueDate: undefined,
  status: 'Pendente',
  paymentMethod: 'PIX',
  assessor: '',
  messenger: '',
};

type DonorOption = { id: string; name: string; code: string; assessor?: string; };
type CollaboratorOption = { name: string };

export function AddDonationDialog({ 
    open, 
    onOpenChange, 
    donation,
    onSave,
    advisors,
    messengers,
    donors
}: { 
    open: boolean; 
    onOpenChange: (open: boolean) => void; 
    donation?: Donation | null; 
    onSave: (data: any) => void;
    advisors: CollaboratorOption[];
    messengers: CollaboratorOption[];
    donors: DonorOption[];
}) {
  const isEditMode = !!donation;
  const [isDonorPopoverOpen, setIsDonorPopoverOpen] = useState(false);

  const form = useForm<AddDonationFormValues>({
    resolver: zodResolver(addDonationSchema),
    defaultValues: { ...defaultFormValues, dueDate: new Date() },
  });

  const donorId = form.watch('donorId');
  const status = form.watch('status');

  useEffect(() => {
    if (open) {
      if (isEditMode && donation) {
        const currentDonor = donors.find(d => d.code === donation.donorCode);
        form.reset({
          donorId: currentDonor?.id || '',
          amount: donation.amount || 0,
          dueDate: donation.dueDate ? new Date(donation.dueDate) : new Date(),
          paymentDate: donation.paymentDate ? new Date(donation.paymentDate) : undefined,
          status: donation.status || 'Pendente',
          paymentMethod: donation.paymentMethod || 'PIX',
          assessor: donation.assessor || '',
          messenger: donation.messenger || '',
        });
      } else {
        form.reset({ ...defaultFormValues, dueDate: new Date() });
      }
    }
  }, [open, donation, isEditMode, form, donors]);
  
  useEffect(() => {
    if (donorId && !isEditMode) {
      const selectedDonor = donors.find(d => d.id === donorId);
      if (selectedDonor) {
        form.setValue('assessor', selectedDonor.assessor || '', { shouldValidate: true });
      }
    }
  }, [donorId, donors, isEditMode, form]);

  useEffect(() => {
    if (status === 'Pago' && !form.getValues('paymentDate')) {
        form.setValue('paymentDate', new Date(), { shouldValidate: true });
    }
  }, [status, form]);

  const onSubmit = (data: AddDonationFormValues) => {
    const donor = donors.find(d => d.id === data.donorId);
    if (!donor) return;

    const submissionData = {
        ...data,
        donorName: donor.name,
        donorCode: donor.code,
        dueDate: format(data.dueDate, 'yyyy-MM-dd'),
        paymentDate: data.paymentDate ? format(data.paymentDate, 'yyyy-MM-dd') : '',
    };
    onSave(isEditMode ? { ...submissionData, id: donation?.id } : submissionData);
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
                <FormField
                  control={form.control}
                  name="donorId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Doador</FormLabel>
                      <Popover open={isDonorPopoverOpen} onOpenChange={setIsDonorPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? donors.find(
                                    (donor) => donor.id === field.value
                                  )?.name
                                : "Selecione o doador"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar doador por nome ou código..." />
                            <CommandList>
                              <CommandEmpty>Nenhum doador encontrado.</CommandEmpty>
                              <CommandGroup>
                                {donors.map((donor) => (
                                  <CommandItem
                                    value={`${donor.name} ${donor.code}`}
                                    key={donor.id}
                                    onSelect={() => {
                                      form.setValue("donorId", donor.id)
                                      setIsDonorPopoverOpen(false)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        donor.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {donor.name} ({donor.code})
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

                <FormField control={form.control} name="amount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl><Input type="number" placeholder="R$ 0,00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="dueDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Data de Vencimento</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal h-10",!field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "dd/MM/yyyy")) : (<span>Selecione a data</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="paymentDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Data de Pagamento</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal h-10",!field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "dd/MM/yyyy")) : (<span>Selecione a data</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
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
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="Transferência Bancária">Transferência Bancária</SelectItem>
                        <SelectItem value="Coleta">Coleta</SelectItem>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="assessor" render={({ field }) => (
                        <FormItem><FormLabel>Assessor</FormLabel><Select onValueChange={field.onChange} value={field.value || ''}><FormControl><SelectTrigger><SelectValue placeholder="Selecione (Opcional)" /></SelectTrigger></FormControl><SelectContent>{advisors.map((assessor) => (<SelectItem key={assessor.name} value={assessor.name}>{assessor.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="messenger" render={({ field }) => (
                        <FormItem><FormLabel>Mensageiro</FormLabel><Select onValueChange={field.onChange} value={field.value || ''}><FormControl><SelectTrigger><SelectValue placeholder="Selecione (Opcional)" /></SelectTrigger></FormControl><SelectContent>{messengers.map((messenger) => (<SelectItem key={messenger.name} value={messenger.name}>{messenger.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
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
