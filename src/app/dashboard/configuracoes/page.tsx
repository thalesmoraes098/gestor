'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const settingsSchema = z.object({
  closingDay: z.string().min(1, { message: 'Por favor, selecione um dia.' }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function ConfiguracoesPage() {
  const { toast } = useToast();
 
  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      closingDay: '5',
    },
  });

  const onSettingsSubmit = async (data: SettingsFormValues) => {
    // In a real app, this would save to a backend. Here we just show a toast.
    toast({
        title: 'Configurações Salvas',
        description: `O dia de fechamento foi atualizado para ${data.closingDay}. (Simulado)`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Ajuste as configurações gerais do sistema.</p>
      </div>

      <Form {...settingsForm}>
        <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}>
          <Card className="rounded-2xl border-0 shadow-lg max-w-2xl">
            <CardHeader>
              <CardTitle>Fechamento da Folha</CardTitle>
              <CardDescription>
                Selecione o dia do mês para o fechamento da folha de pagamento. Isso afetará como os períodos são calculados nos relatórios de comissão.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={settingsForm.control}
                name="closingDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de Fechamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o dia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={String(day)}>
                            Dia {String(day).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Exemplo: Se você escolher o dia 5, o relatório de "Julho" considerará as comissões pagas entre 5 de Junho e 4 de Julho.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
