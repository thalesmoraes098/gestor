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
  photoUrl: z.string().optional().or(z.literal('')),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  phone: z.string().min(1, { message: 'O telefone é obrigatório.' }),
  goal: z.coerce.number().min(0, { message: 'A meta não pode ser negativa.' }),
  newClientsGoal: z.coerce.number().min(0, { message: 'A meta de clientes não pode ser negativa.' }),
  minCommissionPercentage: z.coerce.number().min(0, { message: 'A comissão não pode ser negativa.' }).max(100, { message: 'A comissão não pode ser maior que 100.' }),
  maxCommissionPercentage: z.coerce.number().min(0, { message: 'A comissão não pode ser negativa.' }).max(100, { message: 'A comissão não pode ser maior que 100.' }),
  status: z.enum(['Ativo', 'Férias', 'Licença Médica', 'Suspensão', 'Demitido']),
}).refine(data => data.maxCommissionPercentage >= data.minCommissionPercentage, {
    message: "A comissão máxima deve ser maior ou igual à mínima.",
    path: ["maxCommissionPercentage"],
});


type AddAdvisorFormValues = z.infer<typeof addAdvisorSchema>;

const defaultFormValues: AddAdvisorFormValues = {
  name: '',
  photoUrl: '',
  email: '',
  phone: '',
  goal: 0,
  newClientsGoal: 0,
  minCommissionPercentage: 0,
  maxCommissionPercentage: 0,
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
          photoUrl: advisor.photoUrl || '',
          email: advisor.email || '',
          phone: advisor.phone || '',
          goal: advisor.goal || 0,
          newClientsGoal: advisor.newClientsGoal || 0,
          minCommissionPercentage: advisor.minCommissionPercentage || 0,
          maxCommissionPercentage: advisor.maxCommissionPercentage || 0,
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
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-4">
                            <img src={field.value || 'https://placehold.co/64x64.png'} alt="Foto do assessor" className="w-16 h-16 rounded-full object-cover"/>
                            <div className="flex-1 space-y-2">
                                <FormLabel>Foto do Assessor</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    field.onChange(reader.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </div>
                    </FormItem>
                  )}
                />
                
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="goal" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meta de Arrecadação (R$)</FormLabel>
                            <FormControl><Input type="number" placeholder="15000.00" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="newClientsGoal" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meta de Novos Clientes</FormLabel>
                            <FormControl><Input type="number" placeholder="10" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="minCommissionPercentage" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comissão Mínima (%)</FormLabel>
                            <FormControl><Input type="number" placeholder="3.0" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="maxCommissionPercentage" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comissão Máxima (%)</FormLabel>
                            <FormControl><Input type="number" placeholder="5.0" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>

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
