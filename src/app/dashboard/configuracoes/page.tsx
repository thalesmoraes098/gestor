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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';


const settingsSchema = z.object({
  closingDay: z.string().min(1, { message: 'Por favor, selecione um dia.' }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function ConfiguracoesPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
 
  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      closingDay: '5',
    },
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
        setLoading(true);
        const settingsRef = doc(db, "system_settings", "general");
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
            const settingsData = settingsSnap.data();
            settingsForm.setValue('closingDay', settingsData.closingDay || '5');
        } else {
            settingsForm.setValue('closingDay', '5'); // Default value
        }
        setLoading(false);
    };
    fetchSettings();
  }, [settingsForm]);

  const onSettingsSubmit = async (data: SettingsFormValues) => {
    try {
        const settingsRef = doc(db, "system_settings", "general");
        await setDoc(settingsRef, { closingDay: data.closingDay }, { merge: true });
        toast({
            title: 'Configurações Salvas',
            description: `O dia de fechamento foi atualizado para ${data.closingDay}.`,
        });
    } catch (error) {
        console.error("Error saving settings: ", error);
        toast({
            variant: "destructive",
            title: 'Erro ao Salvar',
            description: 'Não foi possível salvar as configurações.',
        });
    }
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
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ) : (
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
                )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={loading}>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
