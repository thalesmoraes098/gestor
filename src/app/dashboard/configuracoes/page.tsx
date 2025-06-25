'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { savedClosingDay, setSavedClosingDay } from '@/lib/config';

const settingsSchema = z.object({
  closingDay: z.string().min(1, { message: 'Por favor, selecione um dia.' }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const newUserSchema = z.object({
    name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
    email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
    password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});
type NewUserFormValues = z.infer<typeof newUserSchema>;

type User = {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Usuário';
};

export default function ConfiguracoesPage() {
  const { toast } = useToast();
  const [currentClosingDay, setCurrentClosingDay] = useState(savedClosingDay);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      closingDay: currentClosingDay,
    },
  });

  const newUserForm = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const fetchUsers = async () => {
    try {
        setLoadingUsers(true);
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setUsers(usersList);
    } catch (error) {
        console.error("Error fetching users: ", error);
        toast({
            variant: "destructive",
            title: "Erro ao buscar usuários",
            description: "Não foi possível carregar a lista de usuários.",
        });
    } finally {
        setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const onSettingsSubmit = (data: SettingsFormValues) => {
    setSavedClosingDay(data.closingDay);
    setCurrentClosingDay(data.closingDay);
    toast({
      title: 'Configurações Salvas',
      description: `O dia de fechamento foi atualizado para ${data.closingDay}.`,
    });
  };

  const onNewUserSubmit = async (data: NewUserFormValues) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const newUser = userCredential.user;

        await setDoc(doc(db, "users", newUser.uid), {
            uid: newUser.uid,
            name: data.name,
            email: data.email,
            role: 'Usuário',
            photoUrl: ''
        });
        
        toast({
            title: 'Usuário Adicionado',
            description: `O usuário ${data.name} foi criado com sucesso.`
        });
        newUserForm.reset();
        fetchUsers(); // Refresh the list
    } catch (error: any) {
        console.error("Error creating user:", error);
        toast({
            variant: "destructive",
            title: 'Erro ao criar usuário',
            description: error.message,
        });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Ajuste as configurações gerais e de usuários do sistema.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Form {...settingsForm}>
            <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}>
              <Card className="rounded-2xl border-0 shadow-lg max-w-2xl mt-4">
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
        </TabsContent>
        
        <TabsContent value="users">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div className="lg:col-span-1">
              <Form {...newUserForm}>
                <form onSubmit={newUserForm.handleSubmit(onNewUserSubmit)} className="space-y-6">
                  <Card className="rounded-2xl border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Adicionar Novo Usuário</CardTitle>
                      <CardDescription>Crie uma nova conta de usuário.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField control={newUserForm.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Nome</FormLabel><FormControl><Input placeholder="Nome do usuário" {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                      <FormField control={newUserForm.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" placeholder="usuario@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                      <FormField control={newUserForm.control} name="password" render={({ field }) => (
                        <FormItem><FormLabel>Senha</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full">Adicionar Usuário</Button>
                    </CardFooter>
                  </Card>
                </form>
              </Form>
            </div>
            <div className="lg:col-span-2">
              <Card className="rounded-2xl border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Usuários Cadastrados</CardTitle>
                  <CardDescription>Lista de todos os usuários do sistema.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Nível</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingUsers ? (
                        <TableRow><TableCell colSpan={3} className="text-center">Carregando...</TableCell></TableRow>
                      ) : users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
