'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { advisorNames, messengerNames } from '@/lib/mock-data';

const filterSchema = z.object({
  status: z.enum(['todos', 'pago', 'pendente', 'atrasado', 'cancelado']).default('todos'),
  assessor: z.string().optional(),
  messenger: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

export function DonationsFilterDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      status: 'todos',
    },
  });

  const onSubmit = (data: FilterFormValues) => {
    console.log('Filtros de doações aplicados:', data);
    onOpenChange(false);
  };

  const handleClear = () => {
    form.reset({
        status: 'todos',
        assessor: '',
        messenger: '',
        startDate: undefined,
        endDate: undefined,
        minAmount: undefined,
        maxAmount: undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Filtros de Doações</DialogTitle>
          <DialogDescription>
            Refine sua busca por doações com os filtros abaixo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Status da Doação</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-x-4 gap-y-2"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="todos" /></FormControl><FormLabel className="font-normal">Todos</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="pago" /></FormControl><FormLabel className="font-normal">Pago</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="pendente" /></FormControl><FormLabel className="font-normal">Pendente</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="atrasado" /></FormControl><FormLabel className="font-normal">Atrasado</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="cancelado" /></FormControl><FormLabel className="font-normal">Cancelado</FormLabel></FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="assessor"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Assessor</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Selecione um assessor" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="todos">Todos Assessores</SelectItem>
                            {advisorNames.map((assessor) => (<SelectItem key={assessor} value={assessor}>{assessor}</SelectItem>))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="messenger"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Mensageiro</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Selecione um mensageiro" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="todos">Todos Mensageiros</SelectItem>
                            {messengerNames.map((messenger) => (<SelectItem key={messenger} value={messenger}>{messenger}</SelectItem>))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <div>
              <FormLabel>Data de Vencimento</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <FormField control={form.control} name="startDate" render={({ field }) => ( <FormItem className="flex flex-col"><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "dd/MM/yyyy")) : (<span>Data inicial</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="endDate" render={({ field }) => ( <FormItem className="flex flex-col"><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "dd/MM/yyyy")) : (<span>Data final</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              </div>
            </div>
            <div>
              <FormLabel>Valor da Doação</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                 <FormField control={form.control} name="minAmount" render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="Valor mínimo" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="maxAmount" render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="Valor máximo" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={handleClear}>Limpar Filtros</Button>
              <Button type="submit">Aplicar Filtros</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
