'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';

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
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Donor } from '@/lib/mock-data';

const addressSchema = z.object({
  cep: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  reference: z.string().optional(),
});

const addDonorSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório.' }),
  code: z.string().optional(),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  status: z.enum(['Ativo', 'Inativo', 'Pendente']),
  assessor: z.string().optional(),
  isLoyal: z.boolean().default(false),
  paymentDay: z.string().optional(),
  phones: z.array(z.object({
    value: z.string().min(1, { message: "O telefone é obrigatório." }),
  })),
  addresses: z.array(addressSchema),
});

type AddDonorFormValues = z.infer<typeof addDonorSchema>;

const defaultFormValues: Omit<AddDonorFormValues, 'phones' | 'addresses'> & { phones: {value: string}[], addresses: any[] } = {
  name: '',
  code: '',
  email: '',
  status: 'Ativo',
  assessor: '',
  isLoyal: false,
  paymentDay: '',
  phones: [{ value: '' }],
  addresses: [{
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    reference: '',
  }]
};

export function AddDonorDialog({
  open,
  onOpenChange,
  donor,
  onSave,
  advisorNames,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donor?: Donor | null;
  onSave: (data: Omit<Donor, 'id' | 'history' | 'amount'> & { id?: string }) => void;
  advisorNames: string[];
}) {
  const isEditMode = !!donor;

  const form = useForm<AddDonorFormValues>({
    resolver: zodResolver(addDonorSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (open) {
      if (isEditMode && donor) {
        form.reset({
          name: donor.name || '',
          code: donor.code || '',
          email: donor.email || '',
          status: donor.status || 'Ativo',
          assessor: donor.assessor || '',
          isLoyal: donor.isLoyal || false,
          paymentDay: donor.paymentDay || '',
          phones: donor.phones && donor.phones.length > 0 ? donor.phones : [{ value: '' }],
          addresses: donor.addresses && donor.addresses.length > 0 ? donor.addresses : [{ cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', reference: '' }],
        });
      } else {
        form.reset(defaultFormValues);
      }
    }
  }, [open, donor, isEditMode, form]);

  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
    control: form.control,
    name: "phones"
  });

  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({
    control: form.control,
    name: "addresses"
  });

  const isLoyal = form.watch('isLoyal');

  const onSubmit = (data: AddDonorFormValues) => {
    const finalData = { ...data };
    if (!isEditMode && !finalData.code) {
      finalData.code = Math.floor(100000 + Math.random() * 900000).toString();
    }
    onSave(isEditMode ? { ...finalData, id: donor?.id } : finalData);
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Doador' : 'Adicionar Doador'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Atualize os dados do doador.' : 'Preencha os dados para cadastrar um novo doador.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh]">
              <div className="grid gap-6 py-4 px-2 pr-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome do Doador</FormLabel>
                            <FormControl>
                            <Input placeholder="João da Silva" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input placeholder="contato@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Código do Doador</FormLabel>
                            <FormControl>
                            <Input placeholder="Será gerado automaticamente se vazio" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Ativo">Ativo</SelectItem>
                                <SelectItem value="Inativo">Inativo</SelectItem>
                                <SelectItem value="Pendente">Pendente</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                
                <FormField
                  control={form.control}
                  name="assessor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessor</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um assessor (Opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {advisorNames.map((assessor) => (
                            <SelectItem key={assessor} value={assessor}>
                              {assessor}
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
                    name="isLoyal"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Doador Fidelizado?
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
                {isLoyal && (
                  <FormField
                      control={form.control}
                      name="paymentDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dia do Pagamento</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o dia do pagamento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                <SelectItem key={day} value={String(day)}>
                                  {String(day).padStart(2, '0')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                )}
                
                <div className="space-y-4">
                    <FormLabel>Endereços</FormLabel>
                    {addressFields.map((field, index) => (
                        <div key={field.id} className="space-y-4 rounded-lg border p-4 relative pt-8">
                             {addressFields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeAddress(index)}
                                    className="text-destructive hover:bg-destructive/10 absolute top-1 right-1"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                             <div className="grid grid-cols-4 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`addresses.${index}.cep`}
                                    render={({ field }) => (
                                        <FormItem className="col-span-4 sm:col-span-1">
                                            <FormLabel>CEP</FormLabel>
                                            <FormControl>
                                                <Input placeholder="00000-000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name={`addresses.${index}.street`}
                                    render={({ field }) => (
                                        <FormItem className="col-span-4 sm:col-span-3">
                                            <FormLabel>Endereço</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Rua, Av, etc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`addresses.${index}.number`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name={`addresses.${index}.complement`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Complemento</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Apto, Bloco" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name={`addresses.${index}.neighborhood`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bairro</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Bairro" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`addresses.${index}.city`}
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Cidade</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Cidade" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name={`addresses.${index}.state`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado</FormLabel>
                                            <FormControl>
                                                <Input placeholder="UF" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                             <FormField
                                control={form.control}
                                name={`addresses.${index}.reference`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ponto de Referência</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Próximo a..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => appendAddress({ cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', reference: '' })}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar outro endereço
                    </Button>
                </div>

                <div className="space-y-4">
                    <FormLabel>Telefones</FormLabel>
                    {phoneFields.map((field, index) => (
                        <FormField
                            key={field.id}
                            control={form.control}
                            name={`phones.${index}.value`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input placeholder="(00) 90000-0000" {...field} />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removePhone(index)}
                                                disabled={phoneFields.length <= 1}
                                                className="text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => appendPhone({ value: "" })}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar outro telefone
                    </Button>
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
