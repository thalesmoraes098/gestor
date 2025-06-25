'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from "date-fns"
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react"

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils";

// This type should be passed in as a prop
type Collaborator = {
  id: string;
  name: string;
  type: 'Assessor' | 'Mensageiro';
}

const filterSchema = z.object({
  collaboratorId: z.string().optional(),
  recipientType: z.enum(['todos', 'assessor', 'mensageiro']).default('todos'),
  status: z.enum(['todos', 'paga', 'pendente']).default('todos'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type FilterFormValues = z.infer<typeof filterSchema>;

export function CommissionsFilterDialog({
  open,
  onOpenChange,
  onApply,
  collaborators
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (data: FilterFormValues) => void;
  collaborators: Collaborator[];
}) {
  const [isCollaboratorPopoverOpen, setIsCollaboratorPopoverOpen] = useState(false);

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      collaboratorId: '',
      recipientType: 'todos',
      status: 'todos',
    },
  });

  const onSubmit = (data: FilterFormValues) => {
    onApply(data);
    onOpenChange(false);
  };

  const handleClear = () => {
    const clearedFilters = {
      recipientType: 'todos' as const,
      status: 'todos' as const,
      collaboratorId: undefined,
      startDate: undefined,
      endDate: undefined,
    }
    form.reset(clearedFilters);
    onApply(clearedFilters);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Filtros de Comissões</DialogTitle>
          <DialogDescription>
            Refine sua busca por comissões com os filtros abaixo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
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
                                    {field.value ? collaborators.find(c => c.id === field.value)?.name : "Selecione o colaborador"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Buscar colaborador..." />
                                <CommandList>
                                  <CommandEmpty>Nenhum colaborador encontrado.</CommandEmpty>
                                  <CommandGroup>
                                    {collaborators.map((c) => (
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="recipientType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Tipo</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="todos" /></FormControl><FormLabel className="font-normal">Todos</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="assessor" /></FormControl><FormLabel className="font-normal">Assessor</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="mensageiro" /></FormControl><FormLabel className="font-normal">Mensageiro</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="todos" /></FormControl><FormLabel className="font-normal">Todos</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="paga" /></FormControl><FormLabel className="font-normal">Paga</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="pendente" /></FormControl><FormLabel className="font-normal">Pendente</FormLabel></FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
            </div>

            <div>
              <FormLabel>Período de Referência (Data de Pagamento)</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <FormField control={form.control} name="startDate" render={({ field }) => ( <FormItem className="flex flex-col"><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "dd/MM/yyyy")) : (<span>Data inicial</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="endDate" render={({ field }) => ( <FormItem className="flex flex-col"><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "dd/MM/yyyy")) : (<span>Data final</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
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
