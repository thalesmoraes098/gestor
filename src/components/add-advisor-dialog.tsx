'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const addAdvisorSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  phone: z.string().min(1, { message: 'O telefone é obrigatório.' }),
  commissionPercentage: z.coerce.number().min(0, { message: 'A comissão não pode ser negativa.' }).max(100, { message: 'A comissão não pode ser maior que 100.' }),
  status: z.enum(['Ativo', 'Férias', 'Licença Médica', 'Suspensão', 'Demitido']),
});

type AddAdvisorFormValues = z.infer<typeof addAdvisorSchema>;

const defaultFormValues: AddAdvisorFormValues = {
  name: '',
  email: '',
  phone: '',
  commissionPercentage: 0,
  status: 'Ativo',
};

export function AddAdvisorDialog({ 
  open, 
  onOpenChange, 
  advisor,
  onInitiateDismissal 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  advisor?: any | null;
  onInitiateDismissal?: (advisor: any) => void; 
}) {
  const isEditMode = !!advisor;

  const form = useForm<AddAdvisorFormValues>({
    resolver: zodResolver(addAdvisorSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (open) {
      if (isEditMode && advisor) {
        form.reset({
          name: advisor.name || '',
          email: advisor.email || '',
          phone: advisor.phone || '',
          commissionPercentage: advisor.commissionPercentage || 0,
          status: advisor.status || 'Ativo',
        });
      } else {
        form.reset(defaultFormValues);
      }
    }
  }, [open, advisor, isEditMode, form]);

  const onSubmit = (data: AddAdvisorFormValues) => {
    if (isEditMode && data.status === 'Demitido' && advisor?.status !== 'Demitido' && onInitiateDismissal) {
      onInitiateDismissal({ ...advisor, ...data });
    } else {
      console.log(isEditMode ? 'Assessor atualizado:' : 'Novo assessor:', data);
    }
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Assessor' : 'Adicionar Assessor'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Atualize os dados do assessor.' : 'Preencha os dados para registrar um novo assessor.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh]">
              <div className="grid gap-6 py-4 px-2 pr-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl><Input placeholder="Nome completo do assessor" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl><Input type="email" placeholder="contato@email.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl><Input placeholder="(00) 90000-0000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                
                <FormField control={form.control} name="commissionPercentage" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentual de Comissão (%)</FormLabel>
                    <FormControl><Input type="number" placeholder="5.0" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Férias">Férias</SelectItem>
                        <SelectItem value="Licença Médica">Licença Médica</SelectItem>
                        <SelectItem value="Suspensão">Suspensão</SelectItem>
                        <SelectItem value="Demitido">Demitido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>
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
