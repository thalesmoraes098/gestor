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
import { Switch } from '@/components/ui/switch';
import type { Messenger } from '@/lib/mock-data';

const addMessengerSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório.' }),
  photoUrl: z.string().optional().or(z.literal('')),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  phone: z.string().min(1, { message: 'O telefone é obrigatório.' }),
  status: z.enum(['Ativo', 'Férias', 'Licença Médica', 'Suspensão', 'Demitido']),
  receivesCommission: z.boolean().default(false),
  commissionPercentage: z.coerce.number().optional(),
}).refine(
  (data) => {
    if (data.receivesCommission) {
      return data.commissionPercentage != null && data.commissionPercentage >= 0 && data.commissionPercentage <= 100;
    }
    return true;
  },
  {
    message: 'O percentual é obrigatório e deve ser entre 0 e 100.',
    path: ['commissionPercentage'],
  }
);

type AddMessengerFormValues = z.infer<typeof addMessengerSchema>;

const defaultFormValues: AddMessengerFormValues = {
  name: '',
  photoUrl: '',
  email: '',
  phone: '',
  status: 'Ativo',
  receivesCommission: false,
  commissionPercentage: 0,
};

export function AddMessengerDialog({ 
  open, 
  onOpenChange, 
  messenger,
  onSave,
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  messenger?: Messenger | null;
  onSave: (data: Omit<Messenger, 'id'> & { id?: string }) => void;
}) {
  const isEditMode = !!messenger;

  const form = useForm<AddMessengerFormValues>({
    resolver: zodResolver(addMessengerSchema),
    defaultValues: defaultFormValues,
  });

  const receivesCommission = form.watch('receivesCommission');

  useEffect(() => {
    if (open) {
      if (isEditMode && messenger) {
        form.reset({
          name: messenger.name || '',
          photoUrl: messenger.photoUrl || '',
          email: messenger.email || '',
          phone: messenger.phone || '',
          status: messenger.status || 'Ativo',
          receivesCommission: messenger.commissionPercentage != null,
          commissionPercentage: messenger.commissionPercentage || 0,
        });
      } else {
        form.reset(defaultFormValues);
      }
    }
  }, [open, messenger, isEditMode, form]);

  const onSubmit = (data: AddMessengerFormValues) => {
    onSave(isEditMode ? { ...data, id: messenger?.id } : data);
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Mensageiro' : 'Adicionar Mensageiro'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Atualize os dados do mensageiro.' : 'Preencha os dados para registrar um novo mensageiro.'}
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
                            <img src={field.value || 'https://placehold.co/64x64.png'} alt="Foto do mensageiro" className="w-16 h-16 rounded-full object-cover"/>
                            <div className="flex-1 space-y-2">
                                <FormLabel>Foto do Mensageiro</FormLabel>
                                <FormControl>
                                  <label htmlFor="photo-upload-messenger" className="w-full cursor-pointer">
                                      <div className="w-full h-10 px-4 py-2 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-semibold hover:bg-primary/20 transition-colors">
                                          Escolher arquivo
                                      </div>
                                      <Input 
                                          id="photo-upload-messenger"
                                          type="file" 
                                          accept="image/*" 
                                          className="hidden"
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
                                      />
                                  </label>
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
                    <FormControl><Input placeholder="Nome completo do mensageiro" {...field} /></FormControl>
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

                <FormField
                  control={form.control}
                  name="receivesCommission"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Recebe Comissão?
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {receivesCommission && (
                  <FormField control={form.control} name="commissionPercentage" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentual de Comissão (%)</FormLabel>
                      <FormControl><Input type="number" placeholder="5,0" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                )}

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
