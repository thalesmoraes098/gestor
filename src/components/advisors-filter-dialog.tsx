'use client';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const filterSchema = z.object({
  status: z.enum(['todos', 'ativo', 'inativo']).default('todos'),
});

type FilterFormValues = z.infer<typeof filterSchema>;

export function AdvisorsFilterDialog({
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
    console.log('Filtros de assessores aplicados:', data);
    onOpenChange(false);
  };

  const handleClear = () => {
    form.reset({
        status: 'todos',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtros de Assessores</DialogTitle>
          <DialogDescription>
            Refine sua busca por assessores com os filtros abaixo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Status do Assessor</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-x-4 gap-y-2"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="todos" /></FormControl><FormLabel className="font-normal">Todos</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="ativo" /></FormControl><FormLabel className="font-normal">Ativo</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="inativo" /></FormControl><FormLabel className="font-normal">Inativo</FormLabel></FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />
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
