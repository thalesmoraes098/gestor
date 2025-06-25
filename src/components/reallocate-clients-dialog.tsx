'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Advisor = {
  id: string;
  name: string;
};

const reallocationSchema = z.object({
  option: z.enum(['company', 'specific', 'automatic'], {
    required_error: 'Você precisa selecionar uma opção.',
  }),
  specificAdvisorId: z.string().optional(),
}).refine(
  (data) => {
    if (data.option === 'specific') {
      return !!data.specificAdvisorId;
    }
    return true;
  },
  {
    message: 'Por favor, selecione um assessor.',
    path: ['specificAdvisorId'],
  }
);

type ReallocationFormValues = z.infer<typeof reallocationSchema>;

export function ReallocateClientsDialog({
  open,
  onOpenChange,
  dismissedAdvisor,
  activeAdvisors,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dismissedAdvisor: Advisor | null;
  activeAdvisors: Advisor[];
}) {
  const form = useForm<ReallocationFormValues>({
    resolver: zodResolver(reallocationSchema),
    defaultValues: {
      option: 'company',
      specificAdvisorId: undefined,
    },
  });

  const selectedOption = form.watch('option');

  useEffect(() => {
    if (open) {
      form.reset({
        option: 'company',
        specificAdvisorId: undefined,
      });
    }
  }, [open, form]);

  const onSubmit = (data: ReallocationFormValues) => {
    console.log(`Reallocation decision for ${dismissedAdvisor?.name}:`, data);
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  }

  if (!dismissedAdvisor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reatribuir Carteira de Clientes</DialogTitle>
          <DialogDescription>
            O assessor {dismissedAdvisor.name} foi demitido. O que você gostaria de fazer com a carteira de clientes dele?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
            <FormField
              control={form.control}
              name="option"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Opções de Reatribuição</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="company" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Manter clientes com a empresa (sem comissão)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="specific" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Reatribuir para um assessor específico
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="automatic" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Dividir automaticamente entre assessores ativos
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedOption === 'specific' && (
              <FormField
                control={form.control}
                name="specificAdvisorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selecione o Assessor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um assessor..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeAdvisors.map((advisor) => (
                          <SelectItem key={advisor.id} value={advisor.id}>
                            {advisor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={handleCancel}>Cancelar</Button>
              <Button type="submit">Confirmar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
